import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FileItem, FileUploader } from "ng2-file-upload";
import { RCMediaObject } from "@rcenter/core";
import { RCParsedAddress } from "@app/shared/services/utils/location.service";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { TimeService } from "@app/shared/services/utils/time.service";

@Component({
  selector: "rc-tournament-edit-page",
  templateUrl: "./tournament-edit-page.component.html",
  styleUrls: ["./tournament-edit-page.component.scss"],
})
export class TournamentEditPageComponent implements OnInit {
  @Input() groupName: string;
  @Input() form: FormGroup;
  logoUploader: FileUploader;
  mainImageUploader: FileUploader;
  richText: string | any;
  logoImage: string | RCMediaObject;
  mainImage: string | RCMediaObject;
  testData: any;
  mainImageDropzoneHover: boolean;

  constructor(private timeService: TimeService, private imagesService: ImagesService) {
    this.logoUploader = new FileUploader({
      isHTML5: true,
      authTokenHeader: null,
      allowedFileType: ["image"],
      allowedMimeType: ["image/png", "image/jpeg", "image/jpeg"],
      maxFileSize: 10 * 1024 * 1024,
    });

    this.mainImageUploader = new FileUploader({
      queueLimit: 1,
      isHTML5: true,
      allowedFileType: ["image"],
      allowedMimeType: ["image/png", "image/jpeg", "image/jpeg"],
      maxFileSize: 10 * 1024 * 1024,
    });

    this.logoUploader.onAfterAddingFile = (file: FileItem) => {
      if (this.logoUploader.queue.length > 1) {
        this.logoUploader.removeFromQueue(this.logoUploader.queue[0]);
      }

      this.imagesService.getBase64FromFile(file._file).subscribe((image) => {
        this.logoImage = image;

        const imageFiles = this.logoUploader.getNotUploadedItems();

        if (imageFiles && imageFiles.length) {
          this.logoImageAdded(imageFiles[0]);
        }
      });
    };
  }

  ngOnInit() {}

  venueSelected(venue: RCParsedAddress) {
    if (venue.timezone) {
      this.form.get(this.groupName).get("timezone").setValue(venue.timezone);
    }
    this.form.get(this.groupName).get("address").setValue(venue);
  }

  mainImageAdded(file) {
    this.form.get(this.groupName).get("mainImage").setValue(file);
  }

  logoImageAdded(file) {
    this.form.get(this.groupName).get("logoImage").setValue(file);
  }

  descInputChanged(newDesc) {
    this.form.get(this.groupName).get("description").setValue(newDesc);
  }

  descInputLengthChanged(newLength) {
    this.form.get(this.groupName).get("description_length").setValue(newLength);
  }

  descShortInputChanged(newDesc) {
    this.form.get(this.groupName).get("shortDescription").setValue(newDesc);
  }

  descShortInputLengthChanged(newLength) {
    this.form.get(this.groupName).get("shortDescription_length").setValue(newLength);
  }
}
