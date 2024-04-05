import {
  CedarWriters,
  ChildDeploymentInfo,
  ComparisonError,
  JsonTemplateElementReader,
  JsonNode,
  JsonPath,
  JsonTemplateElementWriter,
  RoundTrip,
  CedarReaders,
  CedarJsonWriters,
  CedarJsonReaders,
} from 'cedar-model-typescript-library';

export class ElementContentComparator {
  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const elementReader: JsonTemplateElementReader = readers.getTemplateElementReader();

    const jsonElementReaderResult = elementReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    const parsingResultErrors = jsonElementReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJsonWriters = CedarWriters.json().getStrict();
    const jsonWriter: JsonTemplateElementWriter = writers.getTemplateElementWriter();
    const reSerialized: JsonNode = jsonWriter.getAsJsonNode(jsonElementReaderResult.element);

    const compareResult = RoundTrip.compare(jsonElementReaderResult, jsonWriter);
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
