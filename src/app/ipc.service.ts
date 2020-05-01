import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';


@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private _ipc: IpcRenderer | undefined;

  constructor() {
    if (window.require) {
      try {
        console.log("IPC loaded...");
        this._ipc = window.require('electron').ipcRenderer;

      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  public on(channel: string, listener: any): void {
    this._ipc.on('file-open', (event, fileData) => {
      listener(fileData);
    })
    if (!this._ipc) {
      return;
    }
  }

  public onNew(listener: any): void {
    this._ipc.on('file-new', (event, message) => {
      listener(message);
    })
  }

  public onData(listener: any): void {
    this._ipc.on('ssh-data', (event, data) => {
      listener(data);
    })
  }

  public onSaveRequest(listener: any): void {
    this._ipc.on('file-save-request', (event, message) => {
      listener(message);
    })
  }

  public send(channel: string, ...args): void {
    this._ipc.send(channel, ...args);
  }

  public save(data): void {
    this.send('file-save', data)
  }

  public tail(data): void {
    this.send('tail-start', data)
  }
  public onSaveCallback(listener): void {
    this._ipc.on('file-saved', (event, message) => {
      listener(message);
    })
  }
}
