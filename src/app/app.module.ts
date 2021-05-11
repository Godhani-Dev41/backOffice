import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/take";
import "rxjs/add/operator/takeLast";

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AgmCoreModule } from "@agm/core";
import { JWT_OPTIONS, JwtModule } from "@auth0/angular-jwt";
import { environment } from "../environments/environment";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { ROUTES } from "./app.routes";
import { APP_PROVIDERS } from "./shared/services/main";
import { CustomFormsModule } from "ng2-validation";
import { SharedModule } from "@app/shared.module";
import { SharedPagesModule } from "@app/shared/shared.pages.module";
import { ToastrModule } from "ngx-toastr";

import { TooltipModule } from "ngx-bootstrap";

import { NZ_I18N, en_US } from "ng-zorro-antd/i18n";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";

registerLocaleData(en);

export function jwtOptionsFactory() {
  return {
    skipWhenExpired: false,
    tokenGetter: () => {
      return localStorage.getItem("id_token");
    },
    whitelistedDomains: [environment.CS_URLS.API_DOMAIN.replace("http://", "").replace("https://", "")],
    blacklistedRoutes: [],
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    ToastrModule.forRoot(),
    TooltipModule.forRoot(),
    CustomFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    SharedModule,
    SharedPagesModule,
    RouterModule.forRoot(ROUTES),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY,
      libraries: ["places"],
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  providers: [...APP_PROVIDERS, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
