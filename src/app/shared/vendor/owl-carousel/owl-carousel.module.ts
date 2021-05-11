import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import 'owl.carousel';
import { OwlCarouselComponent } from './owl-carousel.component';
import { OwlChildComponent } from './owl-child.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    OwlCarouselComponent,
    OwlChildComponent
  ],
  exports: [
    OwlCarouselComponent
  ]
})
export class OwlCarouselModule { }
