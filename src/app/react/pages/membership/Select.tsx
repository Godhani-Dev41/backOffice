/** @jsx jsx */
import FooterWithButtons from "app/react/components/shared/FooterWithButtons/FooterWithButtons";
import { membershipStore } from "app/react/stores/membershipStore";
import React, { useEffect, useState, Fragment } from "react";
import { CustomerTypeEnum, Membership } from "app/react/types/membership";
import { useHistory } from "react-router-dom";
import { Box, Card, CardActions, CardContent, CardMedia, CircularProgress, Grid, Typography } from "@material-ui/core";
import Button from "app/react/components/shared/Button/Button";
import { jsx, css } from "@emotion/react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { TranslationEn } from "../../../../assets/i18n/en";
import { membershipApi } from "../../lib/api/membershipApi";
import { colors } from "../../styles/theme";
import ThreeColumnLayout from "app/react/layouts/ThreeColumn";

const mainGridCss = css`
  height: 100vh;
`;

const mainCardCss = css`
  height: 320px;
  width: 100%;
  max-width: 375px;
`;

const cardContentCss = css`
  height: 100%;
`;

const createTextCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
  }
`;

const buttonContainerCss = css`
  text-align: center;
`;

const largeButtonCss = css`
  &.MuiButton-root {
    font-size: 1.6rem;
    font-weight: 700;
    width: 172px;
    height: 48px;
  }
`;

const cardActionsCss = css`
  justify-content: flex-end;
`;

const mainCss = css`
  padding-top: 72px;
  padding-left: 15px;
  padding-right: 15px;
`;

const viewButtonCss = css`
  background-color: ${colors.brandSecondary};
  color: white;
  font-weight: 700;
  &:hover {
    background-color: ${colors.brandSecondary};
  }
`;

const editButtonCss = css`
  &.MuiButton-root {
    text-transform: none;
  }
`;

const detailTitleCss = css`
  &.MuiTypography-root {
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: uppercase;
    color: ${colors.formInputBg};
    white-space: nowrap;
  }
`;

const nameCss = css`
  &.MuiTypography-root {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${colors.brandPrimary};
  }
`;

const priceCss = css`
  &.MuiTypography-root {
    font-weight: 700;
    color: ${colors.brandPrimary};
  }
`;

const detailsCss = css`
  padding: 10px 0;
`;

const memberCardCss = css`
  max-height: 360px;
  width: 100%;
  max-width: 320px;
`;

const detail = (title: string, text: any, isPrice: boolean, key: number = 0) => {
  return (
    <Grid key={key} container css={detailsCss}>
      <Grid item xs={12}>
        <Typography css={detailTitleCss}>{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        {!isPrice ? <Typography color="primary">{text}</Typography> : <Typography css={priceCss}>${text}</Typography>}
      </Grid>
    </Grid>
  );
};

interface Props {
  organizationId: number;
}

export const Select = ({ organizationId }: Props) => {
  const resetMembershipState = useResetRecoilState(membershipStore.editCreate);

  const [membershipList, setMembershipList] = useState<Membership[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const history = useHistory();

  const createMembership = () => {
    history.push("/details");
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      resetMembershipState();

      const results = await membershipApi.getMembershipsByOrganizationId(organizationId);
      if (results.length) setMembershipList(results);

      setLoading(false);
    })();
  }, []);

  const moveToDashboard = (id: number) => {
    history.push(`/dashboard/${id}`);
  };

  const moveToDetails = (id: number) => {
    history.push(`/details/${id}`);
  };

  const translateCustomerType = (t) => {
    switch (t) {
      case CustomerTypeEnum.INDIVIDUAL:
        return TranslationEn.memberships.dashboard.customerTypes.individual;
      case CustomerTypeEnum.FAMILY:
        return TranslationEn.memberships.dashboard.customerTypes.family;
    }
  };

  return (
    <Fragment>
      {!membershipList.length ? (
        <ThreeColumnLayout>
          <Grid container justify="center" alignContent="center" alignItems="center" css={mainGridCss}>
            <ThreeColumnLayout.Main>
              <Grid container justify="center" alignContent="center" alignItems="center" css={mainGridCss}>
                <Grid item>
                  <Card css={mainCardCss}>
                    <Box height={320} width={375}>
                      <Grid container justify="center" alignItems="center" css={cardContentCss}>
                        <Grid item sm={12}>
                          <Grid container justify="center" alignItems="center" spacing={8}>
                            {loading ? (
                              <CircularProgress />
                            ) : (
                              <Fragment>
                                <Grid item sm={8}>
                                  <Typography color="primary" css={createTextCss}>
                                    {TranslationEn.memberships.selectPage.title}
                                  </Typography>
                                </Grid>
                                <Grid item sm={12} css={buttonContainerCss}>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    css={largeButtonCss}
                                    onClick={createMembership}
                                  >
                                    {TranslationEn.memberships.selectPage.button}
                                  </Button>
                                </Grid>
                              </Fragment>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </ThreeColumnLayout.Main>
          </Grid>
        </ThreeColumnLayout>
      ) : (
        <ThreeColumnLayout.Content hasFooter>
          <Grid container justify="flex-start" alignItems="flex-start" spacing={3} css={mainCss}>
            {membershipList.map((membership) => (
              <Grid key={membership.id} item css={memberCardCss}>
                <Card>
                  <div style={{ height: "8px", width: "100%", backgroundColor: colors.brandSecondary }} />
                  <CardMedia
                    component="img"
                    height="108"
                    image={membership.mainMedia ? membership.mainMedia.url : "assets/media/img/emptyMembership.svg"}
                  />
                  <CardContent css={cardContentCss}>
                    <Typography css={nameCss}>{membership.name}</Typography>
                    {membership.customerTypes.map((type, idx) =>
                      detail(TranslationEn.memberships.dashboard.customerType, translateCustomerType(type), false, idx),
                    )}
                    {membership.package &&
                      detail(
                        TranslationEn.memberships.dashboard.price,
                        membership.package.parentProduct.currPrice.price,
                        true,
                      )}
                  </CardContent>
                  <CardActions css={cardActionsCss}>
                    <Button
                      onClick={() => moveToDetails(membership.id)}
                      css={editButtonCss}
                      size="small"
                      color="primary"
                    >
                      {TranslationEn.memberships.selectPage.edit}
                    </Button>
                    <Button
                      onClick={() => moveToDashboard(membership.id)}
                      css={viewButtonCss}
                      size="small"
                      color="primary"
                    >
                      {TranslationEn.memberships.selectPage.view}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <FooterWithButtons
            submitted={createMembership}
            nextBtnName={TranslationEn.memberships.selectPage.create}
            hideCancelBtn
          />
        </ThreeColumnLayout.Content>
      )}
    </Fragment>
  );
};
