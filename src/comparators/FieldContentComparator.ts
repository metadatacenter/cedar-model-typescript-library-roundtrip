import {
  CedarWriters,
  ChildDeploymentInfo,
  ComparisonError,
  JSONFieldReader,
  JsonNode,
  JsonPath,
  JSONTemplateFieldWriter,
} from 'cedar-model-typescript-library';

export class FieldContentComparator {
  private static fieldReader: JSONFieldReader = JSONFieldReader.getStrict();

  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const jsonFieldReaderResult = this.fieldReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    const parsingResultErrors = jsonFieldReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarWriters = CedarWriters.getStrict();
    const jsonWriter: JSONTemplateFieldWriter = writers.getJSONFieldWriterForField(jsonFieldReaderResult.field);
    const reSerialized: JsonNode = jsonWriter.getAsJsonNode(jsonFieldReaderResult.field);

    const compareResult = JSONFieldReader.getRoundTripComparisonResult(jsonFieldReaderResult, jsonWriter);
    const compareResultErrors = compareResult.getBlueprintComparisonErrors();
    return {
      parsingResultErrors,
      compareResultErrors,
      reSerialized,
    };
  }
}
