// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
const API_DOMAIN = "https://api.bondsports.co";
const CLOUDINARY_BUCKET = "rcenter";

window["process"] = { env: { NODE_ENV: "production" } };

export const environment = {
  production: true,
  INTERCOM_ID: "r8n5hkbk",
  STRIPE_KEY: "pk_live_MT5x6mwkEvYK72GjyCScYWEp00VB4Llufz",
  CLOUDINARY_ROOT: "https://res.cloudinary.com/" + CLOUDINARY_BUCKET + "/image/upload",
  CLOUDINARY_API_ROOT: "https://api.cloudinary.com/v1_1/" + CLOUDINARY_BUCKET + "/image/upload",
  CLOUDINARY_UPLOAD_PRESET: "tm4almj6",
  GOOGLE_API_KEY: "AIzaSyB7VvpbTdksIbqrsehkC5pjFM8En7Ls6pA",
  CS_URLS: {
    API_DOMAIN: API_DOMAIN,
    API_ROOT: API_DOMAIN + "/v1",
    API_ROOT_V2: API_DOMAIN + "/v2",
    API_ROOT_V3: API_DOMAIN + "/v3",
  },
  SITE_URL: "https://backoffice.bondsports.co/login",
  CONSUMER_SITE_URL: "https://www.bondsports.co/",
  MOBILE_LEAGUE_URL: "https://mobile.bondsports.co/app/league/",
  DEBUG_RECOIL: false,
};
