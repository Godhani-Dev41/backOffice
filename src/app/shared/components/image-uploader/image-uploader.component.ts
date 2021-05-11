import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ImagesService } from '@app/shared/services/utils/images.service';

@Component({
  selector: 'rc-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  uploader: FileUploader;
  mainImageDropzoneHover: boolean;
  @Input() imageTitle: string;
  @Input() text: string;
  @Input() image: string;
  @Output() onFileAdded = new EventEmitter<FileItem>();
  constructor(private toastr: ToastrService, private imagesService: ImagesService) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedFileType: ['image'],
      allowedMimeType: ['image/png', 'image/jpeg', 'image/jpeg'],
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onWhenAddingFileFailed = () => {
      this.toastr.error('This file type is not supported');
    };

    this.uploader.onAfterAddingFile = (file: FileItem) => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }

      this.imagesService.getBase64FromFile(file._file).subscribe((image) => {
        this.image = image;

        const imageFiles = this.uploader.getNotUploadedItems();

        if (imageFiles && imageFiles.length) {
          this.onFileAdded.emit(imageFiles[0]);
        }
      });
    };
  }

  /**
   * During drag over the file input of main images we want
   * to add animation to the hovered element and toggle focused state
   * @param isHovered
   */
  fileOverPhotoDrag(isHovered: boolean): void {
    this.mainImageDropzoneHover = isHovered;
  }
}
