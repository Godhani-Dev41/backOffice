import { AgePipe } from "./shared/pipes/age.pipe";
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BackgroundImageDirective } from "@app/shared/directives/background-image/background-image.directive";
import { AdminGuard } from "@app/shared/guards/admin-guard.guard";
import { MediaUrlPipe } from "@app/shared/pipes/media-url.pipe";
import { TruncatePipe } from "@app/shared/pipes/truncate.pipe";
import { LoaderCssModule } from "./shared/components/loader-css/loader-css.module";
import { AuthGuard } from "./shared/guards/auth.guard";
import { OwlCarouselModule } from "./shared/vendor/owl-carousel/owl-carousel.module";

@NgModule({
  declarations: [BackgroundImageDirective],
  imports: [LoaderCssModule, FormsModule, ReactiveFormsModule, CommonModule, RouterModule, OwlCarouselModule],
  exports: [LoaderCssModule, FormsModule, CommonModule, RouterModule, OwlCarouselModule, BackgroundImageDirective],
  providers: [AdminGuard, AuthGuard, MediaUrlPipe, AgePipe, TruncatePipe, DatePipe],
})
export class SharedModule {}
