import { CedarWriters, ChildDeploymentInfo, JSONElementReader, JsonPath, JSONTemplateElementWriter } from 'cedar-model-typescript-library';

export class ElementContentComparator {
  private static elementReader: JSONElementReader = JSONElementReader.getStrict();

  static compare(parsedContent: any) {
    let doLog = false;
    const jsonElementReaderResult = this.elementReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    if (jsonElementReaderResult.parsingResult.getBlueprintComparisonErrorCount() > 0) {
      console.log('Parsing error count: ' + jsonElementReaderResult.parsingResult.getBlueprintComparisonErrorCount());
      doLog = true;
    }
    const writers: CedarWriters = CedarWriters.getFebruary2024();
    const jsonWriter: JSONTemplateElementWriter = writers.getJSONTemplateElementWriter();

    const compareResult = JSONElementReader.getRoundTripComparisonResult(jsonElementReaderResult, jsonWriter);
    if (compareResult.getBlueprintComparisonErrorCount() > 0) {
      console.log('Comparison results: ' + JSON.stringify(compareResult, null, 2));
      doLog = true;
    }
    return doLog;
  }
}
