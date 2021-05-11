import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContextmenuComponent } from './contextmenu.component';
import { ContextmenuDirective } from './contextmenu.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ContextmenuDirective,
    ContextmenuComponent
  ],
  bootstrap: [

  ],
  providers: [
  ],
  exports: [
    ContextmenuDirective,
    ContextmenuComponent
  ]
})
export class ContextmenuModule { }
