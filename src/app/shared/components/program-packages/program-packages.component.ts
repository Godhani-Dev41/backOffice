import { Component, Input, OnInit } from '@angular/core';
import { RCProgramProduct } from '@app/shared/services/programs/programs.service';
import { FormGroup } from '@angular/forms';

export interface PackageOptions {
  value: number;
  description: string;
}

@Component({
  selector: 'rc-program-packages',
  templateUrl: './program-packages.component.html',
  styleUrls: ['./program-packages.component.scss'],
})
export class ProgramPackagesComponent implements OnInit {
  @Input() labelString: string;
  @Input() subLabelString: string;
  @Input() segmentCount: number;
  @Input() package: FormGroup;
  @Input() newPackage: boolean = false;

  packageOptions: PackageOptions[] = [];
  blankPackage: RCProgramProduct;
  tempPackage: RCProgramProduct;

  addPackage: boolean = false;

  constructor() {}

  ngOnInit() {}

  addPackageBtn = () => {
    this.addPackage = true;
  };

}
