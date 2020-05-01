import { Component, ViewEncapsulation } from '@angular/core';
import { NgZone } from '@angular/core';
import { IpcService } from './ipc.service';
import { AppModel, OFile } from './app.model';
import { WSAEPROVIDERFAILEDINIT } from 'constants';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { debounce } from 'lodash';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'app';
  data = 'Load your file here...';
  fullName = 'john';
  counter = 1;
  fileModel: AppModel;
  activeFile;
  textFilter: string;
  tailMode: boolean = false;

  constructor(private readonly ipc: IpcService,
    private ngZone: NgZone) {
    this.search = debounce(this.search, 100);


    this.fileModel = new AppModel();
    this.ipc.on('file-open', (fileData) => {
      let fileName: string = fileData.name;
      fileName = this.getFileNameFromPath(fileName);
      this.ngZone.run(() => {
        let oFile: OFile = {
          name: fileName,
          content: fileData.content,
          active: true,
          info: fileData.content,
          id: 'file_' + this.fileModel.files.length
        }
        this.fileModel.files.push(oFile);
      });
    });

    this.ipc.onNew(() => {
      this.ngZone.run(() => {

        let oFile: OFile = {
          name: 'Untitled' + this.counter++,
          content: '',
          active: true,
          info: '',
          id: 'file_' + this.fileModel.files.length
        }
        this.fileModel.files.push(oFile);
      });
    });

    this.ipc.onData((data) => {
      this.ngZone.run(() => {
        let selectedFile = this.getActiveFile();
        selectedFile.content = selectedFile.content + data;
        selectedFile.info = selectedFile.content;

        let div = $('#' + selectedFile.id)[0];
        div.scrollTop = div.scrollHeight;

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
    return this.fileModel.files.filter((file) => file.active == true)[0];
  }

  private getFileNameFromPath(fileName: string) {
    return fileName.substr(fileName.lastIndexOf('/') + 1);
  }
  onSelect(data: TabDirective): void {
    this.activeFile = data.heading;

    this.fileModel.files.filter((file) => {
      if (file.name == this.activeFile) {
        file.active = true;
      } else {
        file.active = false;
      }
    })[0];
  }


  public onFilterChange(newVal) {
    let file: OFile = this.getActiveFile();
    this.search(file, newVal.target.value);
  }

  toggleTailMode(): void {
    if (!this.tailMode) {
      console.log("On");
      let file: OFile = this.getActiveFile();
      if (file) {
        let lines: number = (file.content.split("\n") || []).length;
        this.ipc.tail(lines);
      }
    } else {
      console.log("Off");
    }
    this.tailMode = !this.tailMode;
  }

  search(file: OFile, filter: string): void {
    if (!filter) {
      file.info = file.content;
    } else {
      let regex = new RegExp('^.*' + filter + '.*\n?', 'mg')
      file.info = file.content.match(regex).toString();
    }
  }
}

