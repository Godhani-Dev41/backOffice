/** @jsx jsx */
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { css, jsx } from "@emotion/react";
import { Card, CardContent, Divider, Grid, Typography } from "@material-ui/core";
import { RCOrganization, RCQuestionnaireObject, RCVenue } from "@rcenter/core";
import CreateStepper from "app/react/components/memberships/CreateStepper/CreateStepper";
import FooterWithButtons from "app/react/components/shared/FooterWithButtons/FooterWithButtons";
import FreeText from "app/react/components/shared/FormControls/FreeText";
import SelectTextInput from "app/react/components/shared/FormControls/SelectTextInput";
import UploadFile from "app/react/components/shared/UploadFile/UploadFile";
import ThreeColumnLayout from "app/react/layouts/ThreeColumn";
import { membershipApi } from "app/react/lib/api/membershipApi";
import { membershipStore } from "app/react/stores/membershipStore";
import { colors } from "app/react/styles/theme";
import { MediaUpload } from "app/react/types/media";
import { CustomerTypeEnum, Membership, MembershipTypeEnum } from "app/react/types/membership";
import { SportsService } from "app/shared/services/utils/sports.service";
import { VenuesService } from "app/shared/services/venues/venues.service";
import { Fragment, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { TranslationEn } from "../../../../assets/i18n/en";

const mainCardCss = css`
  width: 100%;
`;

const cardContentCss = css`
  &.MuiCardContent-root {
    padding: 20px;
  }
`;

const titleCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
    text-align: left;
  }
`;

const cardTitleCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
  }
`;

const dividerCss = css`
  margin-top: 15px;
  margin-bottom: 20px;
`;

const inputCss = css`
  .MuiFormLabel-root {
    color: ${colors.formInputBg};
  }
`;

interface Props {
  organization: RCOrganization;
  venuesService: VenuesService;
  organizationService: OrganizationsService;
  sportsService: SportsService;
}

export const Details = ({ organization, venuesService, organizationService, sportsService }: Props) => {
  const history = useHistory();
  const [facilities, setFacilities] = useState<RCVenue[]>([]);
  const [questionnaires, setQuestionnaires] = useState<RCQuestionnaireObject[]>([]);
  const [sports] = useState(sportsService.getSports());
  const [, setMembershipState] = useRecoilState(membershipStore.editCreate);
  const [membership, setMembership] = useState<Membership | undefined>();
  const { membershipId } = useParams();
  const steps = ["Details", "Members", "Type", "Pricing"];

  const handleSubmitForm = async (formValues: { [x: string]: never }) => {
    const { activity, customerType, description, facilityId, forms, name, numberOfPeople } = formValues;
    setMembershipState((state) => {
      const editingMembership = membershipId ? state.editingMembership : null;
      return {
        //...state, we want to clear possibly stored data
        id: Number.parseInt(membershipId),
        organizationId: organization.id,
        activity,
        customerTypes: [customerType],
        numberOfPeople: parseInt(numberOfPeople),
        facilityId,
        questionnaires: [forms], // for now we allow just 1 questionnaire
        name,
        description,
        steps,
        gender: -1, // just to give it ANY number
        membershipType: MembershipTypeEnum.FIXED, // the default will be fixed

        // keep states that were set in this page
        membershipPicture: state && state.membershipPicture ? state.membershipPicture : null,
        editingMembership,
      };
    });
    return true;
  };

  let validateForm: () => Promise<unknown> | undefined;
  let formValues: { [x: string]: never };

  useEffect(() => {
    async function loadMembership() {
      if (!membershipId) return;

      let membership = await membershipApi.getMembershipById(membershipId);
      membership.numberOfPeople = membership.package.children.length > 0 ? membership.package.children.length : 1;

      setMembershipState((state) => ({
        ...state,
        editingMembership: membership,
      }));
      setMembership(membership);
    }

    loadMembership();
  }, [membershipId, setMembershipState, setMembership]);

  const nextPage = async () => {
    const valid = await validateForm();
    if (valid) history.push("/settings/" + (membershipId ? membershipId : ""));
  };

  const cancelled = () => {
    history.push("/select");
  };

  const handleFileUploaded = (membershipPicture: MediaUpload) => {
    setMembershipState((state) => ({
      ...state,
      membershipPicture,
    }));
  };

  useEffect(() => {
    async function loadFacilitiesAndForms() {
      const orgFacilities = await venuesService.getOrganizationVenues(organization.id).toPromise();
      setFacilities(orgFacilities.data);
      const qnnres = await organizationService.getOrganizationQuestionnaires(organization.id).toPromise();
      setQuestionnaires(qnnres.data);
    }
    loadFacilitiesAndForms();
  }, [organization, venuesService, organizationService]);

  const forms = membership && membership.questionnaires.length ? membership.questionnaires[0] : null;
  const customerType = membership && membership.customerTypes.length ? membership.customerTypes[0] : null;
  const initValues = membership ? { ...membership, forms, customerType } : {};

  return (
    <Fragment>
      <ThreeColumnLayout>
        <ThreeColumnLayout.LeftSidebar>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <Typography color="primary" css={titleCss}>
                {TranslationEn.memberships.detailsPage.title}
              </Typography>
            </Grid>
            <Grid item sm={12}>
              <Card>
                <UploadFile
                  fileUploaded={handleFileUploaded}
                  backgroundImage={membership && membership.mainMedia && membership.mainMedia.url}
                />
              </Card>
            </Grid>
          </Grid>
        </ThreeColumnLayout.LeftSidebar>
        <ThreeColumnLayout.Main>
          <ThreeColumnLayout.Content hasFooter>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                {<CreateStepper steps={steps} activeStep={0} />}
              </Grid>
              <Form
                id="step-details-form"
                initialValues={initValues}
                onSubmit={handleSubmitForm}
                render={({ handleSubmit, values }) => {
                  validateForm = handleSubmit;
                  formValues = values;

                  return (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                      <Grid container spacing={4}>
                        <Grid item sm={12}>
                          <Card css={mainCardCss}>
                            <CardContent css={cardContentCss}>
                              <Typography color="primary" css={cardTitleCss}>
                                {TranslationEn.memberships.detailsPage.detailCardTitle}
                              </Typography>
                              <Divider css={dividerCss} />
                              <Grid container spacing={2}>
                                <Grid item sm={12} css={inputCss}>
                                  <FreeText
                                    controlName="name"
                                    text={TranslationEn.memberships.detailsPage.name}
                                    require={true}
                                  />
                                </Grid>
                                <Grid item sm={12} css={inputCss}>
                                  <FreeText
                                    controlName="description"
                                    text={TranslationEn.memberships.detailsPage.description}
                                    multiline={true}
                                    require={true}
                                  />
                                </Grid>
                                <Grid item sm={6} css={inputCss}>
                                  <SelectTextInput
                                    controlName="customerType"
                                    text={TranslationEn.memberships.detailsPage.customerType}
                                    require={true}
                                    menuOptions={[
                                      {
                                        text: TranslationEn.memberships.dashboard.customerTypes.individual,
                                        value: CustomerTypeEnum.INDIVIDUAL,
                                      },
                                      {
                                        text: TranslationEn.memberships.dashboard.customerTypes.family,
                                        value: CustomerTypeEnum.FAMILY,
                                      },
                                    ]}
                                  />
                                </Grid>
                                <Grid item sm={6} css={inputCss}>
                                  <SelectTextInput
                                    controlName="activity"
                                    text={TranslationEn.memberships.detailsPage.activity}
                                    require={false}
                                    menuOptions={sports.map((s) => ({
                                      text: s.name.charAt(0).toUpperCase() + s.name.slice(1),
                                      value: s.id,
                                    }))}
                                  />
                                </Grid>
                                {formValues.customerType === CustomerTypeEnum.FAMILY && (
                                  <Grid item sm={6} css={inputCss}>
                                    <FreeText
                                      controlName="numberOfPeople"
                                      text={TranslationEn.memberships.detailsPage.numberOfPeople}
                                      require={true}
                                    />
                                  </Grid>
                                )}
                                <Grid item sm={12} css={inputCss}>
                                  <SelectTextInput
                                    controlName="facilityId"
                                    text={TranslationEn.memberships.detailsPage.facility}
                                    require={false}
                                    menuOptions={facilities.map((f) => ({ text: f.name, value: f.id }))}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item sm={12}>
                          <Card css={mainCardCss}>
                            <CardContent css={cardContentCss}>
                              <Typography color="primary" css={cardTitleCss}>
                                {TranslationEn.memberships.detailsPage.formsCardTitle.toUpperCase()}
                              </Typography>
                              <Divider css={dividerCss} />
                              <Grid container spacing={2}>
                                <Grid item sm={12} css={inputCss}>
                                  <SelectTextInput
                                    controlName="forms"
                                    text={TranslationEn.memberships.detailsPage.forms}
                                    require={false}
                                    menuOptions={questionnaires.map((q: RCQuestionnaireObject) => ({
                                      text: q.title,
                                      value: q.id,
                                    }))}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </form>
                  );
                }}
              />
            </Grid>
          </ThreeColumnLayout.Content>
        </ThreeColumnLayout.Main>
        <ThreeColumnLayout.RightSidebar>
          <Grid item sm={false} md={12} />
        </ThreeColumnLayout.RightSidebar>
      </ThreeColumnLayout>
      <FooterWithButtons submitted={nextPage} cancelled={cancelled} />
    </Fragment>
  );
};
