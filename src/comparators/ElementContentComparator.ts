import {
  CedarWriters,
  ChildDeploymentInfo,
  ComparisonError,
  JSONTemplateElementReader,
  JsonNode,
  JsonPath,
  JSONTemplateElementWriter,
  RoundTrip,
  CedarReaders,
  CedarJSONWriters,
  CedarJSONReaders,
} from 'cedar-model-typescript-library';

export class ElementContentComparator {
  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJSONReaders = CedarReaders.json().getStrict();
    const elementReader: JSONTemplateElementReader = readers.getTemplateElementReader();

    const jsonElementReaderResult = elementReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    const parsingResultErrors = jsonElementReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJSONWriters = CedarWriters.json().getStrict();
    const jsonWriter: JSONTemplateElementWriter = writers.getJSONTemplateElementWriter();
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
