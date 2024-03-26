import { CedarWriters, JSONTemplateReader, JSONTemplateWriter } from 'cedar-model-typescript-library';

export class TemplateContentComparator {
  private static templateReader: JSONTemplateReader = JSONTemplateReader.getStrict();

  static compare(parsedContent: any): boolean {
    let doLog = false;
    const jsonTemplateReaderResult = this.templateReader.readFromObject(parsedContent);

    if (jsonTemplateReaderResult.parsingResult.getBlueprintComparisonErrorCount() > 0) {
      console.log('Parsing error count: ' + jsonTemplateReaderResult.parsingResult.getBlueprintComparisonErrorCount());
      doLog = true;
    }
    const writers: CedarWriters = CedarWriters.getFebruary2024();
    const jsonWriter: JSONTemplateWriter = writers.getJSONTemplateWriter();

    const compareResult = JSONTemplateReader.getRoundTripComparisonResult(jsonTemplateReaderResult, jsonWriter);
    if (compareResult.getBlueprintComparisonErrorCount() > 0) {
      console.log('Comparison results: ' + JSON.stringify(compareResult, null, 2));
      doLog = true;
    }
    return doLog;
  }
}
