/** @jsx jsx */
import { membershipStore } from "app/react/stores/membershipStore";
import FooterWithButtons from "app/react/components/shared/FooterWithButtons/FooterWithButtons";
import { TabContext, TabPanel } from "@material-ui/lab";
import { Grid, Tab, Tabs, Typography } from "@material-ui/core";
import { jsx, css } from "@emotion/react";
import { membershipApi } from "app/react/lib/api/membershipApi";
import { useResetRecoilState } from "recoil";
import { TranslationEn } from "../../../../assets/i18n/en";
import DetailsPanel from "../../components/memberships/DashboardPanels/Details";
import MembersPanel from "../../components/memberships/DashboardPanels/Members";
import { Membership } from "../../types/membership";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { colors } from "../../styles/theme";

const gridContainerCss = css`
  margin: 10px 10px 0 10px;
`;

const tabsWrapperCss = css`
  .MuiTab-root {
    text-transform: none;
    color: ${colors.brandPrimary};
    border-radius: 2px;
    min-width: auto;
    min-height: auto;
    height: 36px;
  }
  .Mui-selected {
    background: ${colors.brandPrimary};
    color: white;
  }
  .MuiTabs-indicator {
    display: none;
  }
  .MuiTab-wrapper {
    width: fit-content;
    font-size: 1.4rem;
  }
`;

const titleCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
  }
`;

const tabCss = css`
  &.MuiTabPanel-root {
    padding-left: 0;
  }

  .MuiContainer-maxWidthLg {
    max-width: none;
    padding-left: 0;
  }
`;

const tabContextWrapperCss = css`
  .MuiTabs-root {
    min-height: auto;
  }
`;

interface Props {
  organizationName: string;
}

export const Dashboard = ({ organizationName }: Props) => {
  const resetMembershipState = useResetRecoilState(membershipStore.editCreate);

  const [activeTab, setActiveTab] = useState<"details" | "members">("details");
  const [membershipData, setMembershipData] = useState<Membership>(null);
  const { membershipId } = useParams();
  const history = useHistory();

  const handleTabChange = (event, value) => {
    setActiveTab(value);
  };

  const editButton = () => {
    history.push(`/details/${membershipId}`);
  };

  useEffect(() => {
    (async () => {
      resetMembershipState();
      try {
        const data = await membershipApi.getMembershipById(membershipId);
        setMembershipData(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <Fragment>
      <Grid container spacing={2} css={gridContainerCss}>
        <Grid item xs={8}>
          <Typography css={titleCss} color="primary">
            {membershipData ? membershipData.name : TranslationEn.memberships.dashboard.title}
          </Typography>
        </Grid>
        <Grid css={tabContextWrapperCss} item xs={12}>
          <TabContext value={activeTab}>
            <Tabs css={tabsWrapperCss} value={activeTab} onChange={handleTabChange}>
              <Tab label={TranslationEn.memberships.dashboard.details} value="details" />
              <Tab label={TranslationEn.memberships.dashboard.members} value="members" />
            </Tabs>
            <TabPanel value="details" css={tabCss}>
              {membershipData && <DetailsPanel data={membershipData} orgName={organizationName} />}
            </TabPanel>
            <TabPanel value="members" css={tabCss}>
              <MembersPanel />
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
      <FooterWithButtons
        cancelled={() => {
          history.push("/");
        }}
        submitted={editButton}
        nextBtnName="Edit"
      />
    </Fragment>
  );
};
