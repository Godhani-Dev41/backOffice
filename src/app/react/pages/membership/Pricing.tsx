/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import {
  Card,
  CardContent,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import CreateStepper from "app/react/components/memberships/CreateStepper/CreateStepper";
import FooterWithButtons from "app/react/components/shared/FooterWithButtons/FooterWithButtons";
import ThreeColumnLayout from "app/react/layouts/ThreeColumn";
import { membershipApi } from "app/react/lib/api/membershipApi";
import { productApi } from "app/react/lib/api/productsApi";
import { required } from "app/react/lib/form";
import { membershipStore } from "app/react/stores/membershipStore";
import { colors } from "app/react/styles/theme";
import { CreateProductDto } from "app/react/types/product";
import { Fragment } from "react";
import { Field as FinalField, Form } from "react-final-form";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { CustomerTypeEnum } from "app/react/types/membership";
import { TranslationEn } from "../../../../assets/i18n/en";

const mainCardCss = css`
  width: 100%;
`;

const cardContentCss = css`
  &.MuiCardContent-root {
    padding: 20px;
    width: 572px;
  }
`;

const createTextCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
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

const metaErrorCss = css`
  color: ${colors.dangerRed};
`;

const priceInputCss = css`
  padding-left: 12px;
  background-color: ${colors.formControlBg};
`;

const dollarCss = css`
  .MuiTypography-colorTextSecondary {
    color: ${colors.brandPrimary};
    font-weight: 500;
  }
`;

const formLabelCss = css`
  color: ${colors.formInputBg};
  font-size: 1.4rem;
`;

export const Pricing = () => {
  const history = useHistory();
  const { membershipId } = useParams();

  const [membershipState] = useRecoilState(membershipStore.editCreate);

  const handleSubmitForm = async (formValues: { [x: string]: never }) => {
    const { price } = formValues;

    if (!price) return false;

    /// set membership product
    const startDate = "1900-01-01";
    const endDate = "2200-01-01";
    const product: CreateProductDto = {
      id: membershipState.editingMembership ? membershipState.editingMembership.package.parentProduct.id : null,
      //downpayment?: null,
      organizationId: membershipState.organizationId,
      name: membershipState.name,
      description: membershipState.description,
      quantity: 1,
      isPublic: true,
      startDate,
      endDate,
      productType: "membership",
      resourcesType: "membership",
      prices: [
        {
          id: membershipState.editingMembership
            ? membershipState.editingMembership.package.parentProduct.prices[0].id
            : null,
          currency: "USD",
          startDate,
          endDate,
          name: membershipState.name,
          price: price,
        },
      ],
    };

    let addOnsData;
    // Only for type family
    if (membershipState.customerTypes[0] === CustomerTypeEnum.FAMILY) {
      addOnsData = JSON.parse(JSON.stringify(product));
      // Set addon price to 0
      addOnsData.prices[0].price = 0;
      product.productType = "package";
      let extraAddOnsData = {
        relationType: "child",
        isPublic: false,
        amountInPackage: membershipState.numberOfPeople, // the numbers of people this package applies to
        name: "single " + membershipState.name,
      };
      Object.assign(addOnsData, extraAddOnsData);
    }

    let updatedMembershipId: number;
    if (membershipId) {
      updatedMembershipId = membershipId;
      const membership = await membershipApi.updateMembership(membershipState);
      const dataToSend = { products: [product] };

      // Only for type family
      if (membershipState.customerTypes[0] === CustomerTypeEnum.FAMILY) {
        Object.assign(dataToSend, { addOnsData: [addOnsData] });
      }
      // serverside will update the existing products+prices by their IDs
      await productApi.createProducts(dataToSend);
    } else {
      const membership = await membershipApi.createMembership(membershipState);
      product.resourcesIdsToApplyOn = [membership.id];
      addOnsData.resourcesIdsToApplyOn = [membership.id];
      const dataToSend = { products: [product] };

      // Only for type family
      if (membershipState.customerTypes[0] === CustomerTypeEnum.FAMILY) {
        Object.assign(dataToSend, { addOnsData: [addOnsData] });
      }

      await productApi.createProducts(dataToSend);

      updatedMembershipId = membership.id;
    }
    if (membershipState.membershipPicture) {
      await membershipApi.updateMembershipMedia(updatedMembershipId, membershipState.membershipPicture);
    }

    membershipApi.saveMembershipToCMS(updatedMembershipId);
    return updatedMembershipId;
  };

  let validateForm: () => Promise<unknown> | undefined;

  const nextPage = async () => {
    const membershipId = await validateForm();
    if (membershipId) {
      history.push(`/dashboard/${membershipId}`);
    }
  };

  const cancelled = () => {
    history.push("/select");
  };

  // memberships have only 1 price - so we use that as the price
  // if we're in edit mode (membershipId) and there are values stored there
  const price =
    membershipId &&
    membershipState.editingMembership &&
    membershipState.editingMembership.package &&
    membershipState.editingMembership.package.parentProduct.prices
      ? membershipState.editingMembership.package.parentProduct.prices[0].price
      : null;

  const nextBtnText = membershipId
    ? TranslationEn.memberships.footer.updateMembership
    : TranslationEn.memberships.footer.createMembership;

  return (
    <Fragment>
      <ThreeColumnLayout>
        <ThreeColumnLayout.LeftSidebar>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <Typography color="primary" css={createTextCss}>
                {TranslationEn.memberships.detailsPage.title}
              </Typography>
            </Grid>
          </Grid>
        </ThreeColumnLayout.LeftSidebar>
        <ThreeColumnLayout.Main>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <CreateStepper steps={membershipState.steps} activeStep={3} />
            </Grid>
            <Form
              id="step-pricing-form"
              initialValues={{ price: price }}
              onSubmit={handleSubmitForm}
              render={({ handleSubmit }) => {
                validateForm = handleSubmit;

                return (
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid container spacing={4}>
                      <Grid item sm={12}>
                        <Card css={mainCardCss}>
                          <CardContent css={cardContentCss}>
                            <Typography color="primary" css={cardTitleCss}>
                              {TranslationEn.memberships.pricingPage.title}
                            </Typography>
                            <Divider css={dividerCss} />
                            <Grid container spacing={2}>
                              <Grid item sm={12}>
                                <FinalField name="price" displayEmpty validate={required}>
                                  {({ input, meta }) => (
                                    <FormControl fullWidth>
                                      <FormLabel css={formLabelCss}>
                                        {TranslationEn.memberships.pricingPage.membershipPrice} {"*"}
                                      </FormLabel>
                                      <Input
                                        disableUnderline
                                        type="number"
                                        css={priceInputCss}
                                        id="standard-adornment-amount"
                                        startAdornment={
                                          <InputAdornment position="start" css={dollarCss}>
                                            $
                                          </InputAdornment>
                                        }
                                        {...input}
                                      />
                                      {meta.error && meta.touched && <div css={metaErrorCss}>{meta.error}</div>}
                                    </FormControl>
                                  )}
                                </FinalField>
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
        </ThreeColumnLayout.Main>
        <ThreeColumnLayout.RightSidebar>
          <Grid item sm={false} md={12} />
        </ThreeColumnLayout.RightSidebar>
      </ThreeColumnLayout>
      <FooterWithButtons submitted={nextPage} cancelled={cancelled} nextBtnName={nextBtnText} />
    </Fragment>
  );
};
