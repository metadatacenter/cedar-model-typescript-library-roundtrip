import * as fs from 'fs';
import * as path from 'path';
import { ResourceLog } from './ResourceLog';
import { JsonNode } from 'cedar-model-typescript-library';

export class LogProcessor {
  private readonly folderPrefix: string;
  private readonly exportJSONPrefix: string;
  private readonly exportYAMLPrefix: string;

  constructor(folderPrefix: string, exportJSONPrefix: string, exportYAMLPrefix: string) {
    this.folderPrefix = folderPrefix;
    this.exportJSONPrefix = exportJSONPrefix;
    this.exportYAMLPrefix = exportYAMLPrefix;
  }

  public processLog(logObject: ResourceLog): void {
    const uuid = this.extractUuid(logObject.id);
    if (!uuid) {
      console.error('Invalid ID format, uuid not found');
      return;
    }
    logObject.uuid = uuid;
    // TODO:uncomment this if you need the parsing and comparison errors
    logObject.compareResultErrors = [];
    logObject.parsingErrors = [];

    logObject.parsingErrorCount = logObject.parsingErrors.length;
    logObject.compareErrorCount = logObject.compareResultErrors.length;
    logObject.compareWarningCount = logObject.compareResultWarnings.length;
    const shardFolder = this.getShardFolder(uuid, this.folderPrefix);
    this.saveLogObject(logObject, uuid, shardFolder);
  }

  public processJSON(id: string, reSerializedJSON: JsonNode, reSerializedYAML: string): void {
    const uuid = this.extractUuid(id);
    if (!uuid) {
      console.error('Invalid ID format, uuid not found');
      return;
    }
    const shardExportJSONFolder = this.getShardFolder(uuid, this.exportJSONPrefix);
    this.saveJSONObject(reSerializedJSON, uuid, shardExportJSONFolder);
    if (reSerializedYAML !== '') {
      const shardExportYAMLFolder = this.getShardFolder(uuid, this.exportYAMLPrefix);
      this.saveYAMLObject(reSerializedYAML, uuid, shardExportYAMLFolder);
    }
  }

  private extractUuid(id: string): string | null {
    const parts = id.split('/');
    return parts.pop() || null;
  }

  private getShardFolder(uuid: string, folderPrefix: string): string {
    const shardPrefix = uuid.substring(0, 2);
    return path.join(folderPrefix, shardPrefix);
  }

  private saveLogObject(logObject: ResourceLog, uuid: string, shardFolder: string): void {
    const filePath = path.join(shardFolder, `${uuid}.json`);
    fs.mkdirSync(shardFolder, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(logObject, null, 2), 'utf8');
  }

  private saveJSONObject(jsonObject: JsonNode, uuid: string, shardFolder: string): void {
    const filePath = path.join(shardFolder, `${uuid}.json`);
    fs.mkdirSync(shardFolder, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, 2), 'utf8');
  }

  private saveYAMLObject(yamlString: string, uuid: string, shardFolder: string): void {
    const filePath = path.join(shardFolder, `${uuid}.yaml`);
    fs.mkdirSync(shardFolder, { recursive: true });
    fs.writeFileSync(filePath, yamlString, 'utf8');
  }
}
