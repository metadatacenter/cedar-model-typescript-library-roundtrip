import {
  CedarJSONReaders,
  CedarJSONWriters,
  CedarReaders,
  CedarWriters,
  ChildDeploymentInfo,
  ComparisonError,
  JsonNode,
  JsonPath,
  JSONTemplateFieldReader,
  JSONTemplateFieldWriter,
  RoundTrip,
} from 'cedar-model-typescript-library';

export class FieldContentComparator {
  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJSONReaders = CedarReaders.json().getStrict();
    const fieldReader: JSONTemplateFieldReader = readers.getTemplateFieldReader();

    const jsonFieldReaderResult = fieldReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    const parsingResultErrors = jsonFieldReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJSONWriters = CedarWriters.json().getStrict();
    const jsonWriter: JSONTemplateFieldWriter = writers.getJSONFieldWriterForField(jsonFieldReaderResult.field);
    const reSerialized: JsonNode = jsonWriter.getAsJsonNode(jsonFieldReaderResult.field);

    const compareResult = RoundTrip.compare(jsonFieldReaderResult, jsonWriter);
    const compareResultErrors = compareResult.getBlueprintComparisonErrors();
    const compareResultWarnings = compareResult.getBlueprintComparisonWarnings();

    return {
      parsingResultErrors,
      compareResultErrors,
      compareResultWarnings,
      reSerialized,
    };
  }
}
