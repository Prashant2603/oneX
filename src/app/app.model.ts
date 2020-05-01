
export class AppModel {
  files: OFile[] = [];
}

export interface OFile {
  name: string,
  content: string,
  active?: boolean,
  info: string,
  id: string
}

