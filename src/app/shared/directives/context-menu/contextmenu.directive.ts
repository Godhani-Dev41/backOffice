/* tslint:disable */

import { Directive, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[contextmenu]',
  providers: []
})
export class ContextmenuDirective {

  @Input('contextmenu') in: any[];
  constructor() {}

  @HostListener('contextmenu', ['$event'])
  onContextmenu(ev: any) {
    const [menu, context] = this.in;

    menu.setContext(context);
    menu.show(ev.clientX, ev.clientY);

    ev.stopPropagation();
    ev.preventDefault();
  }
}
