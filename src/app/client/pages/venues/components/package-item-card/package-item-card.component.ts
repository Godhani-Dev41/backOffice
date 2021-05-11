import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rc-package-item-card',
  templateUrl: './package-item-card.component.html',
  styleUrls: ['./package-item-card.component.scss']
})
export class PackageItemCardComponent implements OnInit {
  @Input() package: any;
  constructor() { }

  ngOnInit() {

  }

  getPackageHours(duration: number) {
    switch (duration) {
      case 30:
        return '1/2 hour';
      case 60:
        return '1 hour';
      case 90:
        return '1.5 hours';
      case 120:
        return '2 hours';
      default:
        return duration + ' minutes';
    }
  }

  getPackageSize(percentage) {
    switch (percentage) {
      case 25:
        return 'Quarter';
      case 33:
        return 'Third';
      case 50:
        return 'Half';
      case 100:
        return 'Full';
      default:
        return '';
    }
  }
}
