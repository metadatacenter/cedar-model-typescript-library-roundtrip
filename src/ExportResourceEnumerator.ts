import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';

import { CedarResource } from './CedarResource';
import { Config } from './Config';
import { ResourceContentParser } from './ResourceContentParser';
import { TemplateContentComparator } from './comparators/TemplateContentComparator';
import { ElementContentComparator } from './comparators/ElementContentComparator';
import { FieldContentComparator } from './comparators/FieldContentComparator';

export class ExportResourceEnumerator {
  private readonly rootPath: string;
  private orderCounter = 0;
  private resourceExportStartPath = '/export/resources';

  constructor() {
    this.rootPath = path.join(Config.get().getCedarHome(), this.resourceExportStartPath);
  }

  public async parse(): Promise<void> {
    await this.parseDirectory(this.rootPath);
  }

  private async parseDirectory(directoryPath: string, virtualPath: string = ''): Promise<void> {
    const shardDirectories = fs
      .readdirSync(directoryPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const shardDirectory of shardDirectories) {
      const shardPath = path.join(directoryPath, shardDirectory.name);
      const zipFiles = fs
        .readdirSync(shardPath, { withFileTypes: true })
        .filter((dirEnt) => dirEnt.isFile() && dirEnt.name.endsWith('.zip'))
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const zipFile of zipFiles) {
        const zipFilePath = path.join(shardPath, zipFile.name);
        try {
          await this.processZipFile(zipFilePath, virtualPath);
        } catch (error) {
          console.error(`Error processing file ${zipFilePath}: ${error}`);
        }
      }
    }
  }

  private async processZipFile(zipFilePath: string, virtualPath: string): Promise<void> {
    const data = fs.readFileSync(zipFilePath);
    const zip = await JSZip.loadAsync(data);
    const resourceJson = await zip.file('resource.json')?.async('string');

    if (resourceJson) {
      const resourceObject = JSON.parse(resourceJson);
      const cedarResource: CedarResource = new CedarResource(
        resourceObject['resourceType'],
        resourceObject['@id'],
        resourceObject['schema:name'],
        path.join(virtualPath, resourceObject['schema:name']),
        zipFilePath.replace(this.rootPath, ''),
        ++this.orderCounter,
      );
      if (cedarResource.getOrderNumber() % 100 == 0) {
        console.log(cedarResource.getOrderNumber());
      }

      // If it's a folder, we need to parse its contents too
      if (cedarResource.getType() === 'folder') {
        const contentFolderPath = zipFilePath.replace('.zip', '');
        if (fs.existsSync(contentFolderPath)) {
          await this.parseDirectory(contentFolderPath, cedarResource.getComputedPath());
        }
      } else {
        // If artifact, we do the comparison
        const contentJson = await zip.file('content.json')?.async('string');
        let doLog = false;
        if (contentJson) {
          try {
            const parsedContent = ResourceContentParser.parseContentJson(contentJson);
            if (cedarResource.getType() == 'template') {
              doLog = TemplateContentComparator.compare(parsedContent);
            } else if (cedarResource.getType() == 'element') {
              doLog = ElementContentComparator.compare(parsedContent);
            } else if (cedarResource.getType() == 'field') {
              doLog = FieldContentComparator.compare(parsedContent);
            } else if (cedarResource.getType() == 'instance') {
              //console.log(cedarResource.getOrderNumber() + ' INSTANCE');
            } else {
              doLog = true;
            }
          } catch (e) {
            console.log(e);
            doLog = true;
          }
        }
        if (doLog) {
          console.log({
            orderNumber: cedarResource.getOrderNumber(),
            type: cedarResource.getType(),
            id: cedarResource.getId(),
            name: cedarResource.getName(),
            computedPath: cedarResource.getComputedPath(),
            physicalPath: cedarResource.getPhysicalPath(),
          });
        }
      }
    }
  }
}
