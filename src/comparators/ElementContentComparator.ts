import {
  CedarWriters,
  ChildDeploymentInfo,
  ComparisonError,
  JSONElementReader,
  JsonNode,
  JsonPath,
  JSONTemplateElementWriter,
} from 'cedar-model-typescript-library';

export class ElementContentComparator {
  private static elementReader: JSONElementReader = JSONElementReader.getStrict();

  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const jsonElementReaderResult = this.elementReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    const parsingResultErrors = jsonElementReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarWriters = CedarWriters.getStrict();
    const jsonWriter: JSONTemplateElementWriter = writers.getJSONTemplateElementWriter();
    const reSerialized: JsonNode = jsonWriter.getAsJsonNode(jsonElementReaderResult.element);

    const compareResult = JSONElementReader.getRoundTripComparisonResult(jsonElementReaderResult, jsonWriter);
    const compareResultErrors = compareResult.getBlueprintComparisonErrors();
    return {
      parsingResultErrors,
      compareResultErrors,
      reSerialized,
    };
  }
}
