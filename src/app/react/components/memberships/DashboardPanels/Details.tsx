/** @jsx jsx */

import { css, jsx } from "@emotion/react";
import { Card, CardContent, Divider, Grid, Typography } from "@material-ui/core";
import Button from "app/react/components/shared/Button/Button";
import ThreeColumnLayout from "app/react/layouts/ThreeColumn";
import { FC, Fragment } from "react";
import { ReactSVG } from "react-svg";
import { TranslationEn } from "../../../../../assets/i18n/en";
import { environment } from "../../../../../environments/environment";
import { getDatesRangeWithYearsOnSameYear } from "../../../lib/dates";
import { colors } from "../../../styles/theme";
import { CustomerTypeEnum, Membership, MembershipTypeEnum } from "../../../types/membership";

const titleCss = css`
  &.MuiTypography-root {
    font-size: 1.6rem;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const dividerCss = css`
  margin-top: 15px;
  margin-bottom: 20px;
`;

const detailTitleCss = css`
  &.MuiTypography-root {
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    color: ${colors.formInputBg};
    white-space: nowrap;
  }
`;

const mainNoCss = css`
  &.MuiTypography-root {
    font-size: 1.2rem;
    font-weight: 500;
    text-align: center;
  }
`;

const secondaryNoCss = css`
  &.MuiTypography-root {
    font-size: 1.2rem;
    font-weight: 400;
    color: ${colors.formInputBg};
    text-align: center;
  }
`;

const mainCardCss = css`
  width: 100%;
  // max-width: 572px;
`;

const cardContentCss = css`
  &.MuiCardContent-root {
    padding: 20px;
  }
`;

const textCss = css`
  font-size: 1.4rem;
  white-space: nowrap;
  text-transform: capitalize;
`;

const genderIconCss = css`
  svg {
    height: 30px;
    width: 30px;
  }
`;

const viewButtonCss = css`
  &.MuiButtonBase-root {
    height: 24px;
    font-size: 1.2rem;
    width: 51px;
  }
`;

interface DetailFieldProps {
  title: string;
  text: any;
}

const DetailField: FC<DetailFieldProps> = (props) => {
  const { title, text } = props;
  const GetGenderImage = () => {
    switch (Number(text)) {
      case 1:
        return (
          <Fragment>
            <ReactSVG css={genderIconCss} src="assets/media/gender/male_idle.svg" />
            <ReactSVG css={genderIconCss} src="assets/media/gender/female_idle.svg" />
          </Fragment>
        );
      case 2:
        return <ReactSVG css={genderIconCss} src="assets/media/gender/male_idle.svg" />;
      case 3:
        return <ReactSVG css={genderIconCss} src="assets/media/gender/female_idle.svg" />;
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography css={detailTitleCss}>{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        {title.toLowerCase() === "gender" ? (
          <GetGenderImage />
        ) : (
          <Typography color="primary" css={textCss}>
            {text}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

interface Props {
  data: Membership;
  orgName: string;
}

const cropperUrl = (url: string) => {
  const cropParam = "/c_fill,ar_1,w_300/";

  const urlObject = new URL(url);
  const parts = urlObject.pathname.split("/");
  const newPath = parts.slice(0, -2).join("/") + cropParam + parts.slice(-2).join("/");
  return "https://" + urlObject.hostname + "/" + newPath;
};

export default function ({ data, orgName }: Props) {
  const goToPublicPage = () => {
    window.open(
      `${environment.CONSUMER_SITE_URL}/${encodeURIComponent(
        orgName.replace(/ /g, "-"),
      )}/memberships/${encodeURIComponent(data.name.replace(/ /g, "-"))}/${data.id}`,
    );
  };

  const isFixed = data.membershipType === MembershipTypeEnum.FIXED;

  const membershipType = isFixed
    ? TranslationEn.memberships.dashboard.memberTypeFixed
    : TranslationEn.memberships.dashboard.memberTypeRolling;

  const translateCustomerType = (t) => {
    switch (t) {
      case CustomerTypeEnum.INDIVIDUAL:
        return TranslationEn.memberships.dashboard.customerTypes.individual;
      case CustomerTypeEnum.FAMILY:
        return TranslationEn.memberships.dashboard.customerTypes.family;
    }
  };
  // TODO remove brs
  return (
    <ThreeColumnLayout>
      {data.mainMedia && data.mainMedia.url ? (
        <ThreeColumnLayout.LeftSidebar>
          <Grid item sm={false} md={12}>
            {data.mainMedia && data.mainMedia.url && (
              <img alt="Membership image" width={"100%"} src={cropperUrl(data.mainMedia.url)} />
            )}
          </Grid>
        </ThreeColumnLayout.LeftSidebar>
      ) : null}
      <ThreeColumnLayout.Main>
        <ThreeColumnLayout.Content>
          <Card css={mainCardCss}>
            <CardContent css={cardContentCss}>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography color="primary" css={titleCss}>
                    {data.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button color="primary" css={viewButtonCss} variant="outlined" onClick={goToPublicPage}>
                    {TranslationEn.memberships.dashboard.viewButton}
                  </Button>
                </Grid>
              </Grid>

              <Divider css={dividerCss} />
              <Typography color="primary">{data.description}</Typography>
            </CardContent>
          </Card>
          <br />
          <Card css={mainCardCss}>
            <CardContent css={cardContentCss}>
              <Grid container spacing={2}>
                {data.customerTypes.map((customerType) => (
                  <Grid item lg={4} md={6} key={customerType}>
                    <DetailField
                      title={TranslationEn.memberships.dashboard.customerType}
                      text={translateCustomerType(customerType)}
                    />
                  </Grid>
                ))}
                <Grid item lg={4} md={6}>
                  <DetailField
                    title={TranslationEn.memberships.dashboard.numberOfPeople}
                    text={data.package.children.length > 0 ? data.package.children.length : 1}
                  />
                </Grid>
                <Grid item lg={4} md={6}>
                  <DetailField title={TranslationEn.memberships.dashboard.facility} text={data.facilityName} />
                </Grid>
                <Grid item lg={4} md={6}>
                  <DetailField title={TranslationEn.memberships.dashboard.membershipType} text={membershipType} />
                </Grid>
                {isFixed && data.startDate && data.endDate && (
                  <Grid item lg={4} md={6}>
                    <DetailField
                      title={TranslationEn.memberships.dashboard.date}
                      text={`${getDatesRangeWithYearsOnSameYear(data.startDate, data.endDate)}`}
                    />
                  </Grid>
                )}
                {isFixed && data.registrationStartDate && data.registrationEndDate && (
                  <Grid item lg={4} md={6}>
                    <DetailField
                      title={TranslationEn.memberships.dashboard.registrationDate}
                      text={`${getDatesRangeWithYearsOnSameYear(data.registrationStartDate, data.registrationEndDate)}`}
                    />
                  </Grid>
                )}
                {data.package && (
                  <Grid item lg={4} md={6}>
                    <DetailField
                      title={TranslationEn.memberships.dashboard.price}
                      text={`$${data.package.parentProduct.currPrice.price}`}
                    />
                  </Grid>
                )}
                <Grid item lg={4} md={6}></Grid>
                <Grid item lg={4} md={6}></Grid>
              </Grid>
            </CardContent>
          </Card>
          <br />
          <br />
          <Card css={mainCardCss} hidden>
            <CardContent css={cardContentCss}>
              <Typography color="primary" css={titleCss}>
                {TranslationEn.memberships.dashboard.addsOnsList}
              </Typography>
              <Divider css={dividerCss} />
              <Grid container>
                <Grid item xs={12}>
                  <Typography color="primary" css={mainNoCss}>
                    {TranslationEn.memberships.dashboard.noAddsOns.main}
                  </Typography>
                  <Typography css={secondaryNoCss}>
                    {TranslationEn.memberships.dashboard.noAddsOns.secondary}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </ThreeColumnLayout.Content>
      </ThreeColumnLayout.Main>
      <ThreeColumnLayout.RightSidebar>
        <Card css={mainCardCss}>
          <CardContent css={cardContentCss}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailField
                  title={TranslationEn.memberships.dashboard.age}
                  text={`${data.minAgeYears} - ${data.maxAgeYears}`}
                />
              </Grid>
              <Grid item xs={6}>
                <DetailField title={TranslationEn.memberships.dashboard.gender} text={data.gender} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <br />
        <Card>
          <CardContent css={cardContentCss}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailField
                  title={TranslationEn.memberships.dashboard.activity}
                  text={TranslationEn.sports[data.activity]}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </ThreeColumnLayout.RightSidebar>
    </ThreeColumnLayout>
  );
}
