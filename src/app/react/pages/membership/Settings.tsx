/** @jsx jsx */
import FooterWithButtons from "app/react/components/shared/FooterWithButtons/FooterWithButtons";
import Button from "app/react/components/shared/Button/Button";
import GenderSelect from "app/react/components/shared/FormControls/GenderSelect";
import NumberRange from "app/react/components/shared/FormControls/NumberRange";
import CreateStepper from "app/react/components/memberships/CreateStepper/CreateStepper";
import { Field as FinalField, Form } from "react-final-form";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import React, { useEffect, Fragment } from "react";
import { jsx, css } from "@emotion/react";
import { useHistory } from "react-router-dom";
import ThreeColumnLayout from "app/react/layouts/ThreeColumn";
import { TranslationEn } from "../../../../assets/i18n/en";
import FreeText from "app/react/components/shared/FormControls/FreeText";
import { useRecoilState } from "recoil";
import { membershipStore } from "app/react/stores/membershipStore";
import { useParams } from "react-router-dom";

const mainCardCss = css`
  width: 100%;
  // max-width: 572px;
`;

const cardContentCss = css`
  &.MuiCardContent-root {
    padding: 20px;
  }
`;

const footerCss = css`
  height: 72px;
  position: fixed;
  bottom: 0;
  box-shadow: 0 2px 22px rgba(21, 93, 148, 0.0749563);
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

const footerHeightCss = css`
  height: 100%;
`;

export const Settings = () => {
  const history = useHistory();
  const { membershipId } = useParams();

  const [membershipState, setMembershipState] = useRecoilState(membershipStore.editCreate);

  const handleSubmitForm = async (formValues: { [x: string]: never }) => {
    const { ageEnd, ageStart, gender, tags } = formValues;

    setMembershipState((state) => ({
      ...state,
      minAgeYears: ageStart,
      maxAgeYears: ageEnd,
      gender: Number(gender),
      //tags
    }));
    return true;
  };
  let validateForm: () => Promise<unknown> | undefined;

  const nextPage = async () => {
    const valid = await validateForm();
    if (valid) history.push("/type/" + (membershipId ? membershipId : ""));
  };

  const cancelled = () => {
    history.push("/select");
  };

  const initValues =
    membershipId && membershipState.editingMembership
      ? {
          ageStart: membershipState.editingMembership.minAgeYears,
          ageEnd: membershipState.editingMembership.maxAgeYears,
          gender: membershipState.editingMembership.gender,
        }
      : {};

  return (
    <Fragment>
      <ThreeColumnLayout>
        <ThreeColumnLayout.LeftSidebar>
          <Grid item sm={false} md={12} />
        </ThreeColumnLayout.LeftSidebar>
        <ThreeColumnLayout.Main>
          <Grid container spacing={4}>
            <Grid item sm={12}>
              <CreateStepper steps={membershipState.steps} activeStep={1} />
            </Grid>
            <Form
              id="step-settings-form"
              initialValues={initValues}
              onSubmit={handleSubmitForm}
              render={({ handleSubmit, values }) => {
                validateForm = handleSubmit;
                return (
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid container spacing={4}>
                      <Grid item sm={12}>
                        <Card css={mainCardCss}>
                          <CardContent css={cardContentCss}>
                            <Typography color="primary" css={cardTitleCss}>
                              {TranslationEn.memberships.settingsPage.settingCardTitle}
                            </Typography>
                            <Divider css={dividerCss} />
                            <Grid container spacing={2}>
                              <Grid item sm={12} md={6}>
                                <NumberRange
                                  controlName="age"
                                  text={TranslationEn.memberships.settingsPage.ageRange}
                                  require={true}
                                  start={values.ageStart}
                                  end={values.ageEnd}
                                />
                              </Grid>
                              <Grid item sm={12} md={6}>
                                <GenderSelect
                                  value={values.gender}
                                  controlName="gender"
                                  text={TranslationEn.memberships.settingsPage.gender}
                                  require={true}
                                />
                              </Grid>
                              {/*
                            <Grid item sm={12}>
                              <FreeText
                                controlName="tags"
                                text={TranslationEn.memberships.settingsPage.tagsLabel}
                                require={true}
                                multiline
                              />
                              <Typography>{TranslationEn.memberships.settingsPage.tagsDesc}</Typography>
                            </Grid>
                            */}
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
        </ThreeColumnLayout.Main>
        <ThreeColumnLayout.RightSidebar>
          <Grid item sm={false} md={12} />
        </ThreeColumnLayout.RightSidebar>
      </ThreeColumnLayout>
      <FooterWithButtons submitted={nextPage} cancelled={cancelled} />
    </Fragment>
  );
};
