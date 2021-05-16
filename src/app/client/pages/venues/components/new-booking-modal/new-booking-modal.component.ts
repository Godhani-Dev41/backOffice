import { ISelectedPaymentDetail } from "@app/react/Example/ChargeExample";

import { switchMap, distinctUntilChanged, debounceTime } from "rxjs/operators";
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { TimeService } from "@app/shared/services/utils/time.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { RCEvent, RCOrganization, RCVenue } from "@rcenter/core";
import { StripeCheckoutHandler, StripeCheckoutLoader } from "ng9-stripe-checkout";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from "rxjs";
import * as moment from "moment-timezone";
import { environment } from "../../../../../../environments/environment";

@Component({
  selector: "rc-new-booking-modal",
  templateUrl: "./new-booking-modal.component.html",
  styleUrls: ["./new-booking-modal.component.scss"],
  exportAs: "modal",
})
export class NewBookingModalComponent implements OnInit {
  loading = false;
  bookingForm: FormGroup;
  editMode = false;
  customerSubscriptionObserver: Subscription;
  typedObservable$ = new Subject<string>();
  organization: RCOrganization;
  customers: any[];
  currentStep: "bookingDetails" | "bookingSummery" = "bookingDetails";
  @Input() spaces: any[];
  @Input() venue: RCVenue;
  @Output() onSavedBooking = new EventEmitter();
  @ViewChild("modal", { static: true }) public modal: ModalDirective;
  currentCourt: any;
  calculatedPackage: any;
  currentSessions: any[];
  repeatMaxDate: Date;
  private stripeCheckoutHandler: StripeCheckoutHandler;
  paymentLoading = false;
  showingPayment = false;

  constructor(
    private timeService: TimeService,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    private toastr: ToastrService,
    private zone: NgZone,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,
    private fb: FormBuilder,
    private venuesService: VenuesService,
    private vRef: ViewContainerRef,
  ) {
    this.bookingForm = this.fb.group({
      startTime: new Date(),
      endTime: new Date(),
      priceSetting: "customPrice",
      allDayEvent: false,
      repeatEvent: false,
      repeatEventOccurance: "weekly",
      repeatEventEndDate: "",
      publicBooking: false,
      name: "",
      notes: "",
      courtSize: 100,
      customerType: "new",
      price: 0,
      customPrice: 0,
      billingOption: "",
      customerId: "",
      customer: this.fb.group({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
      }),
    });

    this.bookingForm.get("repeatEventOccurance").valueChanges.subscribe(() => {
      this.repeatMaxDate = this.getRepeaterMaxDateValue(this.bookingForm.get("startTime").value);
    });

    this.authService.currentOrganization.subscribe((response) => {
      this.organization = response;
    });

    this.customerSubscriptionObserver = this.typedObservable$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.organizationService.searchCustomers(this.organization.id, term)),
      )
      .subscribe((result) => {
        this.zone.run(() => {
          this.customers = result.data.map((i) => {
            return {
              text: i.name,
              id: {
                id: i.id,
                entityId: i.entityId,
                entityType: i.entityType,
                email: i.email,
                phone: i.phone,
              },
            };
          });
        });
      });
  }

  ngOnInit() {}

  onSubmit(data) {}

  cancel() {
    this.modal.hide();
  }

  showModal({ resource, date }) {
    this.resetForm();
    this.currentCourt = this.spaces.find((i) => i.id === Number(resource.id));
    const dateItem = this.timeService.convertTimeZone(date, "gmt");
    const replacedDate = moment.tz(dateItem, "YYYY-MM-DDTHH:mm:ss", moment.tz.guess()).format();

    this.bookingForm.get("startTime").setValue(replacedDate);
    this.bookingForm.get("endTime").setValue(moment(replacedDate).add(2, "hours"));
    this.modal.show();
  }

  resetForm() {
    this.currentSessions = [];
    this.calculatedPackage = null;
    this.currentStep = "bookingDetails";
    this.bookingForm.reset({
      startTime: new Date(),
      endTime: new Date(),
      allDayEvent: false,
      repeatEvent: false,
      repeatEventOccurance: "weekly",
      publicBooking: false,
      name: "",
      notes: "",
      price: 0,
      priceSetting: "customPrice",
      billingOption: "",
      courtSize: 100,
      customerType: "new",
      customPrice: 0,
      customerId: "",
      customer: this.fb.group({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
      }),
    });
  }

  decrementPrice() {
    if (this.bookingForm.get("customPrice").value < 1) return;

    this.bookingForm.get("customPrice").setValue(this.bookingForm.get("customPrice").value - 1);
  }

  incrementPrice() {
    this.bookingForm.get("customPrice").setValue(this.bookingForm.get("customPrice").value + 1);
  }

  onCustomerTyped(event: { term: string, items: any[] }) {
    this.typedObservable$.next(event.term);
  }

  customerSelected(data) {
    if (data) {
      this.bookingForm.get("customerId").setValue(data.id.id);
      this.handleCustomerSelected(data);
    }
  }

  async handleCustomerSelected(data) {
    this.payingUserId = data.id.entityId;
    if (!this.payingUserId) {
      await this.getUserIdForNewCustomer(data.id.email, data.id.phone, data.text, "");
    }
  }

  async goToSummery() {
    this.loading = true;
    try {
      const sessions = this.getSessions();
      if (!sessions || !sessions.length) return this.toastr.error("No valid sessions found");

      if (!this.bookingForm.get("name").value) {
        this.toastr.error("Reservation name must be provided");
        return;
      }

      if (this.bookingForm.get("customerType").value === "new") {
        if (!this.bookingForm.get("customer").get("name").value) {
          this.toastr.error("Customer name must be provided");
          return;
        }

        if (!this.bookingForm.get("customer").get("email").value) {
          this.toastr.error("Email address must be provided");
          return;
        }
      } else {
        if (!this.bookingForm.get("customerId").value) {
          this.toastr.error("Customer must be selected or created");
          return;
        }
      }

      await this.updateCalculatedPrices(sessions);

      const availabilityResponse = await this.venuesService
        .calculateSpaceAvailability(this.venue.id, this.currentCourt.id, sessions)
        .toPromise();

      this.currentSessions = this.getMappedAvailabilitySessions(availabilityResponse.data);
      this.currentStep = "bookingSummery";
    } catch (e) {
      console.error(e);
      this.toastr.error("Error occurred while creating calculations");
    } finally {
      this.loading = false;
    }
  }

  async updateCalculatedPrices(sessions) {
    const calculatedPackages = await this.venuesService
      .calculateBestPackage(this.venue.id, this.currentCourt.id, sessions)
      .toPromise();

    this.calculatedPackage = calculatedPackages.data;
    if (this.calculatedPackage && this.calculatedPackage.package) {
      if (Math.round(this.calculatedPackage.resourcePackageAmount) !== this.calculatedPackage.resourcePackageAmount) {
        this.calculatedPackage.resourcePackageAmount = this.calculatedPackage.resourcePackageAmount.toFixed(2);
      }

      this.bookingForm.get("price").setValue(this.getCalculatedPrice(this.calculatedPackage));
      this.bookingForm.get("customPrice").setValue(this.getCalculatedPrice(this.calculatedPackage));
      this.bookingForm.get("priceSetting").setValue("packagePrice");
    }
  }

  getMappedAvailabilitySessions(availabilityMap) {
    if (!availabilityMap || !availabilityMap.times) return [];

    const sessions = this.getSessions().map((i) => {
      const foundAvailability = availabilityMap.times.find((j) => {
        return moment(j.startDate).isSame(i.startDate) && moment(j.endDate).isSame(i.endDate);
      });

      return {
        isValid: foundAvailability && foundAvailability.isValid,
        ...i,
        startDate: new Date(i.startDate.slice(0, -1)), // moment.tz(i.startDate, moment.tz.guess()),
        endDate: new Date(i.endDate.slice(0, -1)), //moment.tz(i.endDate, moment.tz.guess()),
      };
    });

    return sessions;
  }

  getSessions() {
    let sessions = [];

    const form = this.bookingForm.value;
    let startTime = form.startTime;
    let endTime = form.endTime;

    if (form.allDayEvent) {
      startTime = moment(form.startTime).set("hour", 0);
      endTime = moment(form.endTime).set("hour", 23);
    }

    // get the actual start/end date/time in the LOCAL location
    const startDateHr = this.timeService.localTimeToSameDateTimeInUTC(startTime);
    const endDateHr = this.timeService.localTimeToSameDateTimeInUTC(endTime);

    const tz = this.venue["timezone"] || moment.tz.guess();
    const singleEvent = {
      startDate: startDateHr, //this.timeService.dateTimeInTimeZone(startDateHr, tz),
      endDate: endDateHr, //this.timeService.dateTimeInTimeZone(endDateHr, tz),
      percentage: form.courtSize,
    };

    sessions.push(singleEvent);

    if (form.repeatEvent) {
      if (!form.repeatEventEndDate || !moment(form.repeatEventEndDate).isValid()) {
        this.toastr.error("Repeat end date must be specified");
        return;
      }
      sessions = this.generateRepeatEvent(form.repeatEventOccurance, form.repeatEventEndDate, singleEvent);
    }

    return sessions;
  }

  getPackageDuration(packageItem: any) {
    if (!packageItem || !packageItem.duration) return "";

    switch (packageItem.duration) {
      case 60:
        return "hr";
      case 30:
        return "1\\2 hr";
      case 90:
        return "1.5 hrs";
      case 120:
        return "2 hrs";
    }
  }

  getCalculatedPrice(calculation) {
    if (!calculation || !calculation.package) return "";

    return Math.floor(calculation.package.price * calculation.resourcePackageAmount);
  }

  selectPriceSetting(type: "customPrice" | "packagePrice") {
    if (!this.calculatedPackage) return;

    this.bookingForm.get("priceSetting").setValue(type);
  }

  get isFreeBooking() {
    const { price, customPrice, priceSetting } = this.bookingForm.value;

    if (priceSetting === "customPrice") return customPrice === 0;
    if (priceSetting === "packagePrice") return price === 0;
  }

  async getUserIdForNewCustomer(email: string, phone: string, firstName: string, lastName: string) {
    const customerResponse = await this.authService.getOrCreateUser(email, firstName, lastName, phone).toPromise();
    this.payingUserId = customerResponse.data.entityId;
    return customerResponse.data;
  }

  async finalizeBooking() {
    if (!this.isFreeBooking && !this.bookingForm.get("billingOption").value) {
      return this.toastr.error("Billing option must be selected(cash or credit card)");
    }
    const form = this.bookingForm.value;

    const data: any = {
      name: form.name,
      dayOfWeek: moment(form.startTime).format("d"),
      startTime: moment(form.startTime).format("HH:mm"),
      creatorId: this.currentCourt.id,
      creatorType: "space",
      description: form.notes,
      organizationId: this.organization.id,
    };

    if (form.priceSetting === "customPrice") {
      data.price = form.customPrice;
    }

    if (form.priceSetting === "packagePrice") {
      data.price = this.getCalculatedPrice(this.calculatedPackage);
    }

    // this whole thing is painful - we're converted right dates to wrong UTC as if
    // until we fix the whole date / time / TZ -- we'll have to keep on playing this game
    const toUTCbullShit = (date) => moment(date).format("YYYY-MM-DDTHH:mm:ss") + "Z";
    const convertedSession = this.currentSessions.map((s) => ({
      ...s,
      startDate: toUTCbullShit(s.startDate),
      endDate: toUTCbullShit(s.endDate),
    }));

    const sessions = JSON.parse(JSON.stringify(convertedSession));
    if (!sessions || !sessions.length) return this.toastr.error("No generated sessions found");

    data.bookedSessions = sessions.map((i) => {
      return {
        percentage: i.percentage,
        startDate: i.startDate,
        endDate: i.endDate,
        timezone: "UTC", // this.venue['timezone'] || moment.tz.guess(),
        spaceId: this.currentCourt.id,
      };
    });

    if (form.billingOption === "cash") {
      data.cashPayment = true;
    }

    if (form.customerType === "new") {
      if (!form.customer.name) return this.toastr.error("Customer name must be provided");

      const email = this.bookingForm.get("customer").get("email").value;
      const phone = this.bookingForm.get("customer").get("phone").value;
      const [firstName, lastName] = this.bookingForm.get("customer").get("name").value.split(" ");
      const customer = await this.getUserIdForNewCustomer(email, phone, firstName, lastName);
      data.customerId = customer.id;
      /*
      data.customer = {
        name: form.customer.name,
        email: form.customer.email,
        phoneNumber: form.customer.phone,
        address: {
          street: form.customer.address,
          city: form.customer.city,
          state: form.customer.state,
          zipcode: form.customer.zipcode
        },
        customerId: form.customerId, // prefetched from creating a new user + customer
      };
*/
    } else {
      data.customerId = form.customerId;
    }

    this.loading = true;
    try {
      const paymentTokenResponse = await this.venuesService
        .getVenuePaymentToken(this.organization.id, form.billingOption === "cash" ? "cash" : "stripe")
        .toPromise();
      data.paymentId = paymentTokenResponse.data.paymentId;

      if (form.billingOption === "creditCard") {
        await this.initOnlinePayment(data);
      } else {
        await this.finishBooking(data);
      }
    } catch (e) {
      this.toastr.error("Error while generating payment token");
      return;
    }
  }

  getRepeaterMaxDateValue(date: Date) {
    if (!date) return null;

    return moment(date).add(36, "months").toDate();

    /*    if (this.bookingForm.get('repeatEventOccurance').value === 'daily') {
		  return moment(date).add(1, 'months').add(2, 'hours').toDate();
		} else if (this.bookingForm.get('repeatEventOccurance').value === 'monthly') {
		  return moment(date).add(12, 'months').add(2, 'hours').toDate();
		} else if (this.bookingForm.get('repeatEventOccurance').value === 'weekly') {
		  return moment(date).add(3, 'months').add(2, 'hours').toDate();
		} else {
		  return moment(date).add(6, 'months').add(2, 'hours').toDate();
		}*/
  }

  generateRepeatEvent(timeframe: "weekly" | "monthly" | "daily", endDate: Date, event) {
    const events = [{ ...event }];
    let lastEvent = event;

    if (!endDate || !moment(endDate).isValid() || moment(lastEvent.startDate).isAfter(endDate)) {
      return events;
    }

    while (moment(lastEvent.startDate).isBefore(moment(endDate).endOf("day"))) {
      const newEvent = JSON.parse(JSON.stringify(lastEvent));
      let startEventDate, endEventDate;

      switch (timeframe) {
        case "weekly":
          startEventDate = moment(lastEvent.startDate).add(1, "week").toDate();
          endEventDate = moment(lastEvent.endDate).add(1, "week").toDate();
          break;
        case "monthly":
          startEventDate = moment(lastEvent.startDate).add(1, "month").toDate();
          endEventDate = moment(lastEvent.endDate).add(1, "month").toDate();
          break;
        case "daily":
          startEventDate = moment(lastEvent.startDate).add(1, "day").toDate();
          endEventDate = moment(lastEvent.endDate).add(1, "day").toDate();
          break;
      }

      newEvent.startDate = startEventDate.toISOString();
      newEvent.endDate = endEventDate.toISOString();

      if (moment(startEventDate).isBefore(moment(endDate).endOf("day"))) {
        events.push(newEvent);
      }

      lastEvent = newEvent;
    }

    return events;
  }

  private rentalCompleteData: any;
  downpayment: number;
  payingUserId: number; // the user id that we're going to charge
  onPaymentCollected(payDetail: ISelectedPaymentDetail) {
    this.showingPayment = false;

    const data = {
      ...this.rentalCompleteData,
      ...{
        amountPaid: this.downpayment,
        paymentData: {
          token: payDetail.token,
          type: payDetail.type,
        },
      },
    };
    this.finishBooking(data);
  }

  // update our showing Payment status with the actual status of the dialog
  // in case the user decided to close it or something else has happened to it and it closed
  onPaymentModalShowingChange(isShowing) {
    this.showingPayment = isShowing;
    this.loading = isShowing;
  }

  async initOnlinePayment(data: any) {
    data.amountPaid = this.downpayment = this.downpayment || data.price;
    this.showingPayment = true;
    this.rentalCompleteData = data;
  }

  async finishBooking(data) {
    // automatic sessions to reservations assigment
    const orderData = this.convertReservationToOrderStructure(data);

    this.paymentLoading = false;
    try {
      await this.venuesService.bookVenueOrder(orderData).toPromise();
      this.onSavedBooking.emit();
      this.toastr.success("Successfully created a new booking");
      this.modal.hide();
    } catch (e) {
      console.error(e);
      this.toastr.error("Error while creating booking object");
    } finally {
      this.loading = false;
    }
  }

  convertReservationToOrderStructure(data) {
    const orderData = {
      answers: [],
      cashPayment: data.cashPayment,
      customer: data.customer,
      customerId: data.customerId,
      nonce: data.nonce,
      organizationId: data.organizationId,
      paymentId: data.paymentId,
      skipPayment: data.skipPayment,
      reservations: [],
      amountPaid: data.amountPaid, // down payment
      paymentData: data.paymentData,
    };

    // automatic sessions to reservations assigment
    // need to create another data flow for user created one
    for (const singleSession of data.bookedSessions) {
      orderData.reservations.push({
        ...data,
        bookedSessions: [singleSession],
        price: data.price / data.bookedSessions.length,
      });
    }

    return orderData;
  }

  doCheckoutStripe(price: number) {
    this.stripeCheckoutHandler.open({
      allowRememberMe: false,
      amount: price * 100,
      currency: "USD",
      name: this.currentCourt.name + " booking",
      opened: () => {
        this.paymentLoading = true;
      },
    });
  }

  async removeEventOccurance(index: number) {
    this.currentSessions.splice(index, 1);
    await this.updateCalculatedPrices(this.currentSessions);
  }
}
