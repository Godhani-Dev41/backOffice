/** @jsx jsx */
import { required } from "app/react/lib/form";
import SelectTextInput from "app/react/components/shared/FormControls/SelectTextInput";
import { colors } from "app/react/styles/theme";
import {
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import CreateStepper from "app/react/components/memberships/CreateStepper/CreateStepper";
import { jsx, css } from "@emotion/react";
import ThreeColumnLayout from "app/react/layouts/ThreeColumn";
import { TranslationEn } from "../../../../assets/i18n/en";
import { Field as FinalField, Form } from "react-final-form";
import { useRecoilState } from "recoil";
import { membershipStore } from "app/react/stores/membershipStore";
import { MembershipTypeEnum } from "app/react/types/membership";
import FooterWithButtons from "app/react/components/shared/FooterWithButtons/FooterWithButtons";
import DatesCard from "../../components/memberships/DatesCard/DatesCard";
import { useParams } from "react-router-dom";

const cardTitleCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
  }
`;

const mainCardCss = css`
  width: 100%;
  // max-width: 572px;
`;

const cardContentCss = css`
  height: 100%;
`;

const dividerCss = css`
  margin-top: 15px;
  margin-bottom: 20px;
`;

const metaErrorCss = css`
  font-size: 1.2rem;
  color: ${colors.dangerRed};
`;

const radioGroupCss = css`
  justify-content: space-between;
  color: ${colors.brandPrimary};
  .MuiTypography-body1 {
    font-size: 1.4rem;
  }
`;

export const Type = () => {
  const history = useHistory();
  const { membershipId } = useParams();

  const [membershipState, setMembershipState] = useRecoilState(membershipStore.editCreate);

  const handleSubmitForm = async (formValues: { [x: string]: never }) => {
    const {
      membershipType,
      startDate,
      endDate,
      registrationStartDate,
      registrationEndDate,
      durationMonths,
    } = formValues;

    if (membershipType == MembershipTypeEnum.ROLLING) {
      setMembershipState((state) => ({
        ...state,
        membershipType,
        durationMonths,
      }));
    } else {
      // this is membership type FIXED
      setMembershipState((state) => ({
        ...state,
        membershipType,
        startDate,
        endDate,
        registrationStartDate,
        registrationEndDate,
      }));
    }
    return true;
  };
  let validateForm: () => Promise<unknown> | undefined;

  const nextPage = async () => {
    const valid = await validateForm();
    if (valid) history.push("/pricing/" + (membershipId ? membershipId : ""));
  };

  const cancelled = () => {
    history.push("/select");
  };

  return (
    <Fragment>
      <ThreeColumnLayout>
        <ThreeColumnLayout.LeftSidebar>
          <Grid item sm={false} md={12} />
        </ThreeColumnLayout.LeftSidebar>
        <ThreeColumnLayout.Main>
          <ThreeColumnLayout.Content hasFooter>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <CreateStepper steps={membershipState.steps} activeStep={2} />
              </Grid>
            </Grid>
            <Form
              id="step-type-form"
              initialValues={membershipId ? membershipState.editingMembership : {}}
              onSubmit={handleSubmitForm}
              render={({ handleSubmit, values }) => {
                validateForm = handleSubmit;
                if (values.membershipType !== membershipState.membershipType) {
                  setMembershipState({ ...membershipState, membershipType: values.membershipType });
                }
                return (
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid container spacing={4}>
                      <Grid item sm={12}>
                        <Card css={mainCardCss}>
                          <CardContent css={cardContentCss}>
                            <Typography color="primary" css={cardTitleCss}>
                              {TranslationEn.memberships.typePage.typeTitle}
                            </Typography>
                            <Divider css={dividerCss} />
                            <Grid container spacing={2}>
                              <Grid item sm={12}>
                                <FinalField
                                  type="radio"
                                  name="membershipType"
                                  validate={require ? required : null}
                                  displayEmpty
                                >
                                  {({ input, meta }) => (
                                    <FormControl fullWidth>
                                      <RadioGroup
                                        aria-label="membership type"
                                        name="type"
                                        css={radioGroupCss}
                                        {...input}
                                      >
                                        <FormControlLabel
                                          name="membershipType"
                                          value={MembershipTypeEnum.FIXED}
                                          control={
                                            <Radio
                                              color="primary"
                                              checked={values.membershipType === MembershipTypeEnum.FIXED}
                                            />
                                          }
                                          label={TranslationEn.memberships.typePage.fixTitle}
                                        />
                                        <FormControlLabel
                                          name="membershipType"
                                          value={MembershipTypeEnum.ROLLING}
                                          control={
                                            <Radio
                                              color="primary"
                                              checked={values.membershipType === MembershipTypeEnum.ROLLING}
                                            />
                                          }
                                          label={TranslationEn.memberships.typePage.rollingTitle}
                                        />
                                      </RadioGroup>
                                      {meta.error && meta.touched && <div css={metaErrorCss}>{meta.error}</div>}
                                    </FormControl>
                                  )}
                                </FinalField>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item sm={12}>
                        {membershipState.membershipType === MembershipTypeEnum.ROLLING && (
                          <Card css={mainCardCss}>
                            <CardContent css={cardContentCss}>
                              <Typography color="primary" css={cardTitleCss}>
                                {TranslationEn.memberships.typePage.renewalTitle}
                              </Typography>
                              <Divider css={dividerCss} />
                              <Grid container spacing={2}>
                                <Grid item sm={12}>
                                  <SelectTextInput
                                    controlName="durationMonths"
                                    text={TranslationEn.memberships.typePage.renewalLabel}
                                    require={true}
                                    menuOptions={[
                                      { text: "Monthly", value: 1 },
                                      { text: "Quarterly", value: 3 },
                                      { text: "Annually", value: 12 },
                                    ]}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        )}
                        {membershipState.membershipType === MembershipTypeEnum.FIXED && <DatesCard />}
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            />
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
