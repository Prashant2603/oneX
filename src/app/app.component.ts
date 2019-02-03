import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { IpcService } from './ipc.service';
import { AppModel, OFile } from './app.model';
import { WSAEPROVIDERFAILEDINIT } from 'constants';
import { TabDirective } from 'ngx-bootstrap/tabs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  data = 'Load your file here...';
  fullName = 'john';
  counter = 1;
  fileModel: AppModel;
  activeFile;

  constructor(private readonly ipc: IpcService,
    private ngZone: NgZone) {

    this.fileModel = new AppModel();
    this.ipc.on('file-open', (fileData) => {
      let fileName: string = fileData.name;
      fileName = this.getFileNameFromPath(fileName);
      this.ngZone.run(() => {
        let oFile: OFile = {
          name: fileName,
          content: fileData.content,
          active: false
        }
        this.fileModel.files.push(oFile);
      });
    });

    this.ipc.onNew(() => {
      this.ngZone.run(() => {

        let oFile: OFile = {
          name: 'Untitled' + this.counter++,
          content: '',
          active: false
        }
        this.fileModel.files.push(oFile);
      });
    });


    this.ipc.onSaveRequest((content: string) => {
      this.ngZone.run(() => {
        let selectedFile = this.getActiveFile();
        this.ipc.save(selectedFile.content);
      });
    });

    this.ipc.onSaveCallback((name: string) => {
      this.ngZone.run(() => {
        this.getActiveFile().name = this.getFileNameFromPath(name);
      });
    });

  }

  private getActiveFile(): OFile {
    return this.fileModel.files.filter((file) => file.name == this.activeFile)[0];
  }

  private getFileNameFromPath(fileName: string) {
    return fileName.substr(fileName.lastIndexOf('/') + 1);
  }
  onSelect(data: TabDirective): void {
    this.activeFile = data.heading;
  }
}

