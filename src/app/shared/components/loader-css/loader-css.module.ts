import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderCssComponent } from './loader-css.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ LoaderCssComponent ],
  exports:      [ LoaderCssComponent ],
  providers:    []
})
export class LoaderCssModule {}
