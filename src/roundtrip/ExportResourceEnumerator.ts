import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';

import { CedarResource } from '../model/CedarResource';
import { Config } from '../model/Config';
import { ResourceContentParser } from './ResourceContentParser';
import { TemplateContentComparator } from '../comparators/TemplateContentComparator';
import { ElementContentComparator } from '../comparators/ElementContentComparator';
import { FieldContentComparator } from '../comparators/FieldContentComparator';
import { ComparisonError, JsonNode } from 'cedar-model-typescript-library';
import { LogProcessor } from '../log/LogProcessor';
import { ResourceLogBuilder } from '../log/ResourceLogBuilder';
import { ResourceLog } from '../log/ResourceLog';
import { SummaryLog } from '../log/SummaryLog';
import { SummaryLogBuilder } from '../log/SummaryLogBuilder';
import { SummaryLogProcessor } from '../log/SummaryLogProcessor';

export class ExportResourceEnumerator {
  private readonly resourceRootPath: string;
  private orderCounter = 0;
  private resourceExportStartPath = '/export-prod-2024-04-03/resources';
  private roundTripLogPath = '/roundtrip';
  private logProcessor: LogProcessor;
  //
  private logSummary: SummaryLog[] = [];
  private summaryLogProcessor: SummaryLogProcessor;
  private counter = 0;
  //
  // private errorStats:

  constructor() {
    this.resourceRootPath = path.join(Config.get().getCedarHome(), this.resourceExportStartPath);
    const logRootPath = path.join(Config.get().getCedarHome(), this.roundTripLogPath);
    this.logProcessor = new LogProcessor(logRootPath);
    this.summaryLogProcessor = new SummaryLogProcessor(logRootPath);
  }

  public async parse(): Promise<void> {
    this.counter = 0;
    await this.parseDirectory(this.resourceRootPath);
    this.summaryLogProcessor.saveLogObject(this.logSummary);
    console.log('Total logged:' + this.logSummary.length);
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
        zipFilePath.replace(this.resourceRootPath, ''),
        ++this.orderCounter,
      );
      // if (cedarResource.getOrderNumber() % 100 == 0) {
      //   console.log(cedarResource.getOrderNumber());
      // }

      // If it's a folder, we need to parse its contents too
      if (cedarResource.getType() === 'folder') {
        const contentFolderPath = zipFilePath.replace('.zip', '');
        if (fs.existsSync(contentFolderPath)) {
          await this.parseDirectory(contentFolderPath, cedarResource.getComputedPath());
        }
      } else {
        // If artifact, we do the comparison
        const contentJson = await zip.file('content.json')?.async('string');
        let parsingResultErrors: ComparisonError[] = [];
        let compareResultErrors: ComparisonError[] = [];
        let compareResultWarnings: ComparisonError[] = [];
        let parsedContent: JsonNode = {};
        let reSerialized: JsonNode = {};
        let exception: any | null = null;
        if (contentJson) {
          try {
            parsedContent = ResourceContentParser.parseContentJson(contentJson);
            if (cedarResource.getType() == 'template') {
              ({ parsingResultErrors, compareResultErrors, compareResultWarnings, reSerialized } =
                TemplateContentComparator.compare(parsedContent));
            } else if (cedarResource.getType() == 'element') {
              ({ parsingResultErrors, compareResultErrors, compareResultWarnings, reSerialized } =
                ElementContentComparator.compare(parsedContent));
            } else if (cedarResource.getType() == 'field') {
              ({ parsingResultErrors, compareResultErrors, compareResultWarnings, reSerialized } =
                FieldContentComparator.compare(parsedContent));
            } else if (cedarResource.getType() == 'instance') {
              //console.log(cedarResource.getOrderNumber() + ' INSTANCE');
            }
          } catch (e) {
            exception = e;
          }
        }
        let doLog = false;
        if (parsingResultErrors.length > 0) {
          doLog = true;
        }
        if (compareResultErrors.length > 0) {
          doLog = true;
        }
        if (compareResultWarnings.length > 0) {
          doLog = true;
        }
        if (exception !== null) {
          doLog = true;
        }
        if (doLog) {
          const logObject: ResourceLog = ResourceLogBuilder.withOrderNumber(cedarResource.getOrderNumber())
            .withId(cedarResource.getId())
            .withName(cedarResource.getName())
            .withComputedPath(cedarResource.getComputedPath())
            .withType(cedarResource.getType())
            .withPhysicalPath(cedarResource.getPhysicalPath())
            .withParsingErrors(parsingResultErrors)
            .withCompareResultErrors(compareResultErrors)
            .withCompareResultWarnings(compareResultWarnings)
            .withSourceJSON(parsedContent)
            .withTargetJSON(reSerialized)
            .withException(exception)
            .build();
          this.logProcessor.processLog(logObject);

          const builder = new SummaryLogBuilder()
            .withOrderNumber(logObject.orderNumber)
            .withType(logObject.type)
            .withUUID(logObject.UUID)
            .withId(logObject.id)
            .withName(logObject.name)
            .withComputedPath(logObject.computedPath)
            .withPhysicalPath(logObject.physicalPath)
            .withParsingErrorCount(logObject.parsingErrorCount)
            .withCompareErrorCount(logObject.compareErrorCount)
            .withCompareWarningCount(logObject.compareWarningCount)
            .withHasException(logObject.exception !== null)
            .withCreatedOn(parsedContent['pav:createdOn'] as string)
            .withLastUpdatedOn(parsedContent['pav:lastUpdatedOn'] as string)
            .withCreatedBy(parsedContent['pav:createdBy'] as string);
          if (typeof parsedContent['description'] !== 'undefined') {
            builder.withCSV2CEDAR((parsedContent['description'] as string).indexOf('CSV2CEDAR') >= 0);
          }
          this.logSummary.push(builder.build());
          this.counter++;
          if (this.counter % 1000 == 0) {
            console.log(this.counter);
          }
        }
      }
    }
  }
}
