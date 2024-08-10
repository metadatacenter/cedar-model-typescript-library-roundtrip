import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';

import { CedarResource } from '../model/CedarResource';
import { Config } from '../model/Config';
import { ResourceContentParser } from './ResourceContentParser';
import { TemplateContentHandler } from '../handlers/TemplateContentHandler';
import { ElementContentHandler } from '../handlers/ElementContentHandler';
import { FieldContentHandler } from '../handlers/FieldContentHandler';
import { ComparisonError, JsonNode } from 'cedar-model-typescript-library';
import { LogProcessor } from '../log/LogProcessor';
import { ResourceLogBuilder } from '../log/ResourceLogBuilder';
import { ResourceLog } from '../log/ResourceLog';
import { SummaryLog } from '../log/SummaryLog';
import { SummaryLogBuilder } from '../log/SummaryLogBuilder';
import { SummaryLogProcessor } from '../log/SummaryLogProcessor';
import { InstanceContentHandler } from '../handlers/InstanceContentHandler';
import { ErrorKey } from '../model/ErrorKey';
import { OutputFormat } from '../model/OutputFormat';

export class ExportResourceEnumerator {
  private readonly resourceRootPath: string;
  private orderCounter = 0;
  private resourceExportStartPath = '/export/resources';
  private roundTripLogPath = '/export-converted-ts/logs';
  private roundTripExportJSONPath = '/export-converted-ts/json';
  private roundTripExportYAMLPath = '/export-converted-ts/yaml';
  private logProcessor: LogProcessor;
  //
  private logSummary: SummaryLog[] = [];
  private summaryLogProcessor: SummaryLogProcessor;
  private counter = 0;
  //
  private errorStats: Map<string, number> = new Map();
  private errorStatsLast2: Map<string, number> = new Map();

  constructor() {
    this.resourceRootPath = path.join(Config.get().getCedarHome(), this.resourceExportStartPath);
    const logRootPath = path.join(Config.get().getCedarHome(), this.roundTripLogPath);
    const exportJSONPath = path.join(Config.get().getCedarHome(), this.roundTripExportJSONPath);
    const exportYAMLPath = path.join(Config.get().getCedarHome(), this.roundTripExportYAMLPath);
    this.logProcessor = new LogProcessor(logRootPath, exportJSONPath, exportYAMLPath);
    this.summaryLogProcessor = new SummaryLogProcessor(logRootPath);
  }

  public async generateLOG(): Promise<void> {
    this.counter = 0;
    await this.parseDirectory(this.resourceRootPath, OutputFormat.LOG);
    this.summaryLogProcessor.saveLogObject(this.logSummary);
    this.summaryLogProcessor.saveErrorStats(this.errorStats, `errors-all.json`);
    this.summaryLogProcessor.saveErrorStats(this.errorStatsLast2, `errors-last-2.json`);
    console.log('Total logged:' + this.logSummary.length);
  }

  public async generateYAML(): Promise<void> {
    this.counter = 0;
    await this.parseDirectory(this.resourceRootPath, OutputFormat.YAML);
    console.log('Total generated:' + this.logSummary.length);
  }

  public async generateJSON(): Promise<void> {
    this.counter = 0;
    await this.parseDirectory(this.resourceRootPath, OutputFormat.JSON);
    console.log('Total generated:' + this.logSummary.length);
  }

  private async parseDirectory(directoryPath: string, outputFormat: OutputFormat, virtualPath: string = ''): Promise<void> {
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
          await this.processZipFile(zipFilePath, outputFormat, virtualPath);
        } catch (error) {
          console.error(`Error processing file ${zipFilePath}: ${error}`);
        }
      }
    }
  }

  private async processZipFile(zipFilePath: string, outputFormat: OutputFormat, virtualPath: string): Promise<void> {
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

      // If it's a folder, we need to parse its contents too
      if (cedarResource.getType() === 'folder') {
        const contentFolderPath = zipFilePath.replace('.zip', '');
        if (fs.existsSync(contentFolderPath)) {
          await this.parseDirectory(contentFolderPath, outputFormat, cedarResource.getComputedPath());
        }
      } else {
        // If artifact, we do the comparison
        const contentJson = await zip.file('content.json')?.async('string');
        let parsingResultErrors: ComparisonError[] = [];
        let compareResultErrors: ComparisonError[] = [];
        let compareResultWarnings: ComparisonError[] = [];
        let parsedContent: JsonNode = {};
        let reSerializedJSON: JsonNode | null = null;
        let reSerializedYAML: string | null = null;
        let exception: unknown | null = null;
        let doSave = true;
        if (contentJson) {
          try {
            parsedContent = ResourceContentParser.parseContentJson(contentJson);
            const topDescription = parsedContent['description'];
            if (topDescription === 'Generated by CSV2CEDAR.') {
              doSave = false;
            }
            if (doSave) {
              if (cedarResource.getType() == 'template') {
                if (outputFormat === OutputFormat.YAML) {
                  reSerializedYAML = TemplateContentHandler.getYAML(parsedContent);
                } else if (outputFormat === OutputFormat.JSON) {
                  reSerializedJSON = TemplateContentHandler.getJSON(parsedContent);
                } else {
                  ({ parsingResultErrors, compareResultErrors, compareResultWarnings, reSerializedJSON } =
                    TemplateContentHandler.compare(parsedContent));
                }
              } else if (cedarResource.getType() == 'element') {
                if (outputFormat === OutputFormat.YAML) {
                  reSerializedYAML = ElementContentHandler.getYAML(parsedContent);
                } else if (outputFormat === OutputFormat.JSON) {
                  reSerializedJSON = ElementContentHandler.getJSON(parsedContent);
                } else {
                  ({ parsingResultErrors, compareResultErrors, compareResultWarnings, reSerializedJSON } =
                    ElementContentHandler.compare(parsedContent));
                }
              } else if (cedarResource.getType() == 'field') {
                if (outputFormat === OutputFormat.YAML) {
                  reSerializedYAML = FieldContentHandler.getYAML(parsedContent);
                } else if (outputFormat === OutputFormat.JSON) {
                  reSerializedJSON = FieldContentHandler.getJSON(parsedContent);
                } else {
                  ({ parsingResultErrors, compareResultErrors, compareResultWarnings, reSerializedJSON } =
                    FieldContentHandler.compare(parsedContent));
                }
              } else if (cedarResource.getType() == 'instance') {
                if (outputFormat === OutputFormat.YAML) {
                  reSerializedYAML = InstanceContentHandler.getYAML(parsedContent);
                } else if (outputFormat === OutputFormat.JSON) {
                  reSerializedJSON = InstanceContentHandler.getJSON(parsedContent);
                } else {
                  ({ parsingResultErrors, compareResultErrors, compareResultWarnings, reSerializedJSON } =
                    InstanceContentHandler.compare(parsedContent));
                }
                doSave = false;
              }
            }
          } catch (e) {
            exception = e;
          }
        }

        if (outputFormat === OutputFormat.LOG && doSave) {
          for (const error of [...parsingResultErrors, ...compareResultErrors, ...compareResultWarnings]) {
            const key = ErrorKey.fromComparisonError(error).toString();
            this.errorStats.set(key, (this.errorStats.get(key) || 0) + 1);
            const key2 = ErrorKey.fromComparisonErrorPartial(error, 2).toString();
            this.errorStatsLast2.set(key2, (this.errorStatsLast2.get(key2) || 0) + 1);
          }

          const logObject: ResourceLog = new ResourceLogBuilder()
            .withOrderNumber(cedarResource.getOrderNumber())
            .withId(cedarResource.getId())
            .withName(cedarResource.getName())
            .withComputedPath(cedarResource.getComputedPath())
            .withType(cedarResource.getType())
            .withPhysicalPath(cedarResource.getPhysicalPath())
            .withParsingErrors(parsingResultErrors)
            .withCompareResultErrors(compareResultErrors)
            .withCompareResultWarnings(compareResultWarnings)
            .withSourceJSON(parsedContent)
            .withTargetJSON(reSerializedJSON)
            .withException(exception as Error)
            .build();
          this.logProcessor.processLog(logObject);

          const builder = new SummaryLogBuilder()
            .withOrderNumber(logObject.orderNumber)
            .withType(logObject.type)
            .withUuid(logObject.uuid)
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
          if (Object.hasOwn(parsedContent, 'description') && typeof parsedContent['description'] == 'string') {
            builder.withCSV2CEDAR((parsedContent['description'] as string).indexOf('CSV2CEDAR') >= 0);
          }
          this.logSummary.push(builder.build());
        }

        if (outputFormat === OutputFormat.YAML && doSave && reSerializedYAML !== null) {
          this.logProcessor.saveYAML(cedarResource.getId(), reSerializedYAML);
        }

        if (outputFormat === OutputFormat.JSON && doSave && reSerializedJSON !== null) {
          this.logProcessor.saveJSON(cedarResource.getId(), reSerializedJSON);
        }

        this.counter++;
        if (this.counter % 1000 == 0) {
          console.log(this.counter);
        }
      }
    }
  }
}
