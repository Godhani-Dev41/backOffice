import { Component, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'rc-contextmenu',
  template: `
    <div class="contextmenu">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `:host(.contextmenu-container) {
        display: none;
        position: fixed;
        z-index: 1300;
    }`,
    `:host(.contextmenu-container.show) {
        display: block;
      }
    `
  ],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[class.contextmenu-container]': '1',
    '[class.show]': 'isVisible'
  }
})
export class ContextmenuComponent {
  @Input('id') id: string;

  context: any = {};
  isVisible = false;

  constructor(private element: ElementRef, private renderer: Renderer2) {
  }

  show(x: number, y: number) {
    this.renderer.setStyle(this.element.nativeElement, 'left', `${x - 20}px`);
    this.renderer.setStyle(this.element.nativeElement, 'top', `${y + 15}px`);
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  setContext(context: any) {
    this.context = context;
  }

  get(path: string|string[]) {
    return this.baseGet(this.context, path) || '';
  }

  private baseGet(object: any, path: string|string[]) {
    path = Array.isArray(path) ? path : path.split('.');

    let index = 0;
    const length = path.length;

    while (object != null && index < length) {
      object = object[(path[index++])];
    }
    return (index && index === length) ? object : undefined;
  }

  @HostListener('document:click', [])
  public onClick(): void {
    this.hide();
  }

  @HostListener('document:scroll', [])
  public onScroll(): void {
    this.hide();
  };
}
