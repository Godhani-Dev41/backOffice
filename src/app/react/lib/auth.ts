import jwt_decode from "jwt-decode";
// import { localStorage } from "./storage";

/**
 * User Token Settings
 * @param token
 */

function setToken(token: string) {
  localStorage.setItem("userToken", token);
}

function getToken() {
  const authCheck = localStorage.getItem("userToken");

  return authCheck || false;
}

function removeToken() {
  // Clear user token data from localStorage
  localStorage.removeItem("userToken");
}

/**
 * User Id settings
 * @param userId
 */
// function setUserId(userId: number) {
//   localStorage.setItem("id_token", userId);
// }

interface Prop {
  id: number;
}
function getUserId() {
  //   const userIdCheck = localStorage.getItem("id_token");
  const { id } = jwt_decode(localStorage.getItem("id_token")) as Prop;
  return id;

  //   return userIdCheck || false;
}

function removeUserId() {
  // Clear user token data from localStorage
  localStorage.removeItem("id_token");
}

function getAuthHeaders() {
  const userToken = getToken();
  const options = {
    headers: {
      accept: "application/json, text/plain, */*",
      authorization: userToken ? `Bearer ${userToken}` : null,
      "Content-Type": "application/json",
    },
  };

  return options;
}

export const auth = {
  setToken,
  getToken,
  removeToken,
  //   setUserId,
  getUserId,
  removeUserId,
  getAuthHeaders,
};
