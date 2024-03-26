import * as fs from 'fs';
import * as path from 'path';
import { ResourceLog } from './ResourceLog';

export class LogProcessor {
  private folderPrefix: string;

  constructor(folderPrefix: string) {
    this.folderPrefix = folderPrefix;
  }

  public processLog(logObject: ResourceLog): void {
    const uuid = this.extractUUID(logObject.id);
    if (!uuid) {
      console.error('Invalid ID format, UUID not found');
      return;
    }
    logObject.UUID = uuid;
    logObject.parsingErrorCount = logObject.parsingErrors.length;
    logObject.compareErrorCount = logObject.compareResultErrors.length;
    const shardFolder = this.getShardFolder(uuid);
    this.saveLogObject(logObject, uuid, shardFolder);
  }

  private extractUUID(id: string): string | null {
    const parts = id.split('/');
    return parts.pop() || null;
  }

  private getShardFolder(uuid: string): string {
    const shardPrefix = uuid.substring(0, 2);
    return path.join(this.folderPrefix, shardPrefix);
  }

  private saveLogObject(logObject: ResourceLog, uuid: string, shardFolder: string): void {
    const filePath = path.join(shardFolder, `${uuid}.json`);
    fs.mkdirSync(shardFolder, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(logObject, null, 2), 'utf8');
  }
}
