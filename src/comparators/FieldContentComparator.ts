import {
  CedarJsonReaders,
  CedarJsonWriters,
  CedarReaders,
  CedarWriters,
  ChildDeploymentInfo,
  ComparisonError,
  JsonNode,
  JsonPath,
  JsonTemplateFieldReader,
  JsonTemplateFieldWriter,
  RoundTrip,
} from 'cedar-model-typescript-library';

export class FieldContentComparator {
  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const fieldReader: JsonTemplateFieldReader = readers.getTemplateFieldReader();

    const jsonFieldReaderResult = fieldReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    const parsingResultErrors = jsonFieldReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJsonWriters = CedarWriters.json().getStrict();
    const jsonWriter: JsonTemplateFieldWriter = writers.getFieldWriterForField(jsonFieldReaderResult.field);
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
