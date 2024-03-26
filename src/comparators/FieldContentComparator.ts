import { CedarWriters, ChildDeploymentInfo, JSONFieldReader, JSONTemplateFieldWriter, JsonPath } from 'cedar-model-typescript-library';

export class FieldContentComparator {
  private static fieldReader: JSONFieldReader = JSONFieldReader.getStrict();

  static compare(parsedContent: any) {
    let doLog = false;
    const jsonFieldReaderResult = this.fieldReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    if (jsonFieldReaderResult.parsingResult.getBlueprintComparisonErrorCount() > 0) {
      console.log('Parsing error count: ' + jsonFieldReaderResult.parsingResult.getBlueprintComparisonErrorCount());
      doLog = true;
    }
    const writers: CedarWriters = CedarWriters.getFebruary2024();
    const jsonWriter: JSONTemplateFieldWriter = writers.getJSONFieldWriterForField(jsonFieldReaderResult.field);

    const compareResult = JSONFieldReader.getRoundTripComparisonResult(jsonFieldReaderResult, jsonWriter);
    if (compareResult.getBlueprintComparisonErrorCount() > 0) {
      console.log('Comparison results: ' + JSON.stringify(compareResult, null, 2));
      doLog = true;
    }
    return doLog;
  }
}
