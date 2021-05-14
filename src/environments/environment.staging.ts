// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
const API_DOMAIN = "https://staging-api.bondsports.co";
const CLOUDINARY_BUCKET = "rcenter";

const process: any = { env: { NODE_ENV: "production" } };
window["process"] = process;

export const environment = {
  production: true,
  INTERCOM_ID: "rk54jlxy",
  STRIPE_KEY: "pk_test_AM4q8Ui1y3iFC2t0YryIRpux00xuUkH1hA",
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
  SITE_URL: "https://stg-bond-backoffice.netlify.app/login",
  CONSUMER_SITE_URL: "https://demand-web-git-staging.bondsports.vercel.app/",
  MOBILE_LEAGUE_URL: "https://stg-bond-mobile.netlify.app/app/league/",
  DEBUG_RECOIL: false,
};
