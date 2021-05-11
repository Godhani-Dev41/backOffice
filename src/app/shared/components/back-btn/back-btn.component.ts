import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'rc-back-btn',
  template: `
    <a href="" class="back-btn no-style" (click)="goBack(); $event.preventDefault();">
      <i class="fa fa-angle-left"></i> BACK
    </a>
  `,
  styleUrls: ['./back-btn.component.scss']
})
export class BackBtnComponent {
  constructor(private location: Location) { }
  goBack() {
    this.location.back();
  }
}
