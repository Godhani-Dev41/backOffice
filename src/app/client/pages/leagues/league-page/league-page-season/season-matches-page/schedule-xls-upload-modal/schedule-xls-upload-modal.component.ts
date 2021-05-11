import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { FileUploaderService } from '@app/shared/services/utils/file-uploader.service';
import { RCLeague, RCLeagueSeason } from '@rcenter/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'rc-schedule-xls-upload-modal',
  templateUrl: './schedule-xls-upload-modal.component.html',
  styleUrls: ['./schedule-xls-upload-modal.component.scss'],
  exportAs: 'modal'
})
export class ScheduleXlsUploadModalComponent implements OnInit {

  loading = false;
  @ViewChild('modal') modal: ModalDirective;
  @Output() onUploaded = new EventEmitter();
  @Input() league: RCLeague;
  @Input() season: RCLeagueSeason;
  uploader: FileUploader;
  constructor(
    private toastr: ToastrService,
    private fileUploaderService: FileUploaderService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.uploader = new FileUploader({
      isHTML5: true,
      authToken: `Bearer ${this.authService.getToken()}`,
      // allowedFileType: ['excel']
    });

    this.uploader.onAfterAddingFile = () => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };

    this.uploader.onWhenAddingFileFailed = () => {
      this.toastr.error('This file type is not supported');
    };
  }

  showModal() {
    this.modal.show();
  }

  cancel() {
    this.modal.hide();
  }

  get selectedFile(): FileItem {
    const files = this.uploader.getNotUploadedItems();
    return files[0];
  }

  onSubmit() {
    if (!this.selectedFile) return this.toastr.warning('File was not selected');
    this.loading = true;

    const url = `/leagues/${this.season.leagueId}/season/${this.season.id}/upload-spreadsheet-schedule`;
    this.fileUploaderService.uploadFile(url, this.selectedFile).subscribe(() => {
      this.loading = false;
      this.onUploaded.emit();
      this.toastr.success('Successfully uploaded excel file');
      this.modal.hide();
    }, (response) => {
      const error = JSON.parse(response);
      this.loading = false;
      this.toastr.error(error ? error.error : 'Error occurred while uploading excel. Make sure the excel file matches the template');
    });
  }
}
