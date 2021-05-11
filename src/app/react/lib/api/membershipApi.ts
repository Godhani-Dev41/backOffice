import { MediaUpload } from "./../../types/media";
import { MembershipMember } from "./../../types/membershipMember";
import { Membership, CreateMembershipDto, UpdateMembrshipDto } from "../../types/membership";
import { environment } from "environments/environment";
import { network } from "../network";

const membershipAPIUrl = `${environment.CS_URLS.API_ROOT_V3}/membership`;

async function getMembershipById(membershipId: number): Promise<Membership> {
  const response = await network.get(`${membershipAPIUrl}/${membershipId}`);

  return response;
}

async function getMembersInMembership(membershipId: number): Promise<MembershipMember[]> {
  const response = await network.get(`${membershipAPIUrl}/${membershipId}/members`);

  return response;
}

async function getMembershipsByOrganizationId(organizationId: number): Promise<Membership[]> {
  const response = await network.get(`${membershipAPIUrl}/organization/${organizationId}`);

  return response;
}

async function createMembership(createMembershipData: CreateMembershipDto): Promise<Membership> {
  // const { headers } = auth.getAuthHeaders();

  const response = await network.post(
    `${membershipAPIUrl}`,
    createMembershipData,
    //headers
  );

  return response;
}

async function updateMembership(updateMembershipData: UpdateMembrshipDto): Promise<Membership> {
  // const { headers } = auth.getAuthHeaders();

  const response = await network.put(
    `${membershipAPIUrl}`,
    updateMembershipData,
    //headers
  );

  return response;
}

async function updateMembershipMedia(membrshipId: number, mediaUploadData: MediaUpload): Promise<Membership> {
  // const { headers } = auth.getAuthHeaders();

  const response = await network.put(
    `${membershipAPIUrl}/${membrshipId}/uploadMedia`,
    mediaUploadData,
    //headers
  );

  return response;
}

async function getMembershipsOrganizationIdQuestion(organizationId: number): Promise<Membership[]> {
  const response = await network.get(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/questionnaires`);

  return response;
}

function saveMembershipToCMS(membershipId: number) {
  // const { headers } = auth.getAuthHeaders();

  network.post(
    `${membershipAPIUrl}/${membershipId}/save-cms`,
    {},
    //headers
  );
}

async function getEntitlementGroupsByOrganiztionId(organizationId: number, entitlementGroups?: string): Promise<any> {
  let entitlementParam = "";
  if (entitlementGroups && entitlementGroups !== "") {
    entitlementParam = `?entitlmentGroups=${entitlementGroups}`;
  }
  const response = await network.get(
    `${environment.CS_URLS.API_ROOT_V3}/entitlementGroups/organization/${organizationId}${entitlementParam}`,
  );

  return response;
}

export const membershipApi = {
  getMembershipById,
  getMembershipsByOrganizationId,
  getMembersInMembership,
  createMembership,
  updateMembership,
  updateMembershipMedia,
  getMembershipsOrganizationIdQuestion,
  saveMembershipToCMS,
  getEntitlementGroupsByOrganiztionId,
};
