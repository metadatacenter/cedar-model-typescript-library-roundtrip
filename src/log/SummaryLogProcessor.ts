import * as fs from 'fs';
import * as path from 'path';
import { SummaryLog } from './SummaryLog';

export class SummaryLogProcessor {
  private folderPrefix: string;

  constructor(folderPrefix: string) {
    this.folderPrefix = folderPrefix;
  }

  public saveLogObject(logObject: SummaryLog[]): void {
    const filePath = path.join(this.folderPrefix, `summary.json`);
    fs.writeFileSync(filePath, JSON.stringify(logObject, null, 2), 'utf8');
  }
}
