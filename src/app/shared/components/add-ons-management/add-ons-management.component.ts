import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatePipe } from "@angular/common";

export type AddOnItem = {
  index: number;
  name: string;
  price: number;
  active: boolean;
  editing: boolean;
  new: boolean;
};

@Component({
  selector: "rc-add-ons-management",
  templateUrl: "./add-ons-management.component.html",
  styleUrls: ["./add-ons-management.component.scss"],
})
export class AddOnsManagementComponent implements OnInit {
  @Input() labelString: string;
  @Input() addOns: AddOnItem[];
  @Input() disabled: boolean = false;
  @Output() onAddOnChange = new EventEmitter<AddOnItem[]>();

  addOnToEdit: AddOnItem = {
    index: -1,
    name: "",
    price: null,
    active: false,
    editing: false,
    new: false,
  };

  nameEditField: string;
  newRecord: boolean;

  constructor(public datePipe: DatePipe) {}

  ngOnInit() {}

  addAddOnBtn = () => {
    this.newRecord = true;
    this.addOnToEdit.index = this.addOns.length;
    this.addOnToEdit.editing = true;
    this.addOnToEdit.active = true;
    this.addOnToEdit.new = true;
    this.addOns.push({ ...this.addOnToEdit });
  };

  editAddOn = (index: number) => {
    this.addOns[index].editing = true;
    this.addOnToEdit = { ...this.addOns[index] };
    this.nameEditField = this.addOnToEdit.name;
    this.addOnToEdit.editing = true;
  };

  doneEditing = () => {
    if (this.addOnToEdit.name && this.addOnToEdit.price) {
      // Prepare AddOnItem to add to array
      this.addOnToEdit.editing = false;
      this.addOnToEdit.active = true;

      // Remove temp obj and add final to constraints
      this.addOns.splice(this.addOnToEdit.index, 1, {
        ...JSON.parse(JSON.stringify(this.addOnToEdit)),
      });

      // Send to @Output()
      this.onAddOnChange.emit(this.addOns);

      // Reset variables for next edit
      this.resetAddOnDefault();
    }
  };

  cancelEdit = (index: number) => {
    this.addOns[this.addOns.findIndex((c) => c.index === index)].editing = false;
    if (this.newRecord) this.addOns.splice(index, 1);
    this.resetAddOnDefault();
  };

  deleteAddOn = (index: number) => {
    this.addOns.splice(index, 1);
    this.onAddOnChange.emit(this.addOns);
    this.resetAddOnDefault();
  };

  resetAddOnDefault = () => {
    this.addOnToEdit.index = -1;
    this.addOnToEdit.name = "";
    this.addOnToEdit.price = null;
    this.addOnToEdit.editing = false;
    this.addOnToEdit.active = false;
    this.nameEditField = "";
    this.newRecord = false;
  };

  priceChanged = (newPrice: number) => {
    this.addOnToEdit.price = newPrice;
  };

  onNameChange = (newName: string) => {
    this.addOnToEdit.name = newName;
  };

  onActiveChange = () => {
    this.onAddOnChange.emit(this.addOns);
  };
}
