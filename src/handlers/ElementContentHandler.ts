import {
  CedarJsonReaders,
  CedarJsonWriters,
  CedarReaders,
  CedarWriters,
  CedarYamlWriters,
  ChildDeploymentInfo,
  ComparisonError,
  JsonNode,
  JsonPath,
  JsonTemplateElementReader,
  JsonTemplateElementWriter,
  RoundTrip,
  YamlTemplateElementWriter,
} from 'cedar-model-typescript-library';

export class ElementContentHandler {
  static jsonReaders: CedarJsonReaders = CedarReaders.json().getStrict();
  static jsonElementReader: JsonTemplateElementReader = ElementContentHandler.jsonReaders.getTemplateElementReader();

  static yamlWriters: CedarYamlWriters = CedarWriters.yaml().getStrict();
  static yamlElementWriter: YamlTemplateElementWriter = ElementContentHandler.yamlWriters.getTemplateElementWriter();

  static jsonWriters: CedarJsonWriters = CedarWriters.json().getStrict();
  static jsonElementWriter: JsonTemplateElementWriter = ElementContentHandler.jsonWriters.getTemplateElementWriter();

  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
  } {
    const jsonElementReaderResult = ElementContentHandler.jsonElementReader.readFromObject(
      parsedContent,
      ChildDeploymentInfo.empty(),
      new JsonPath(),
    );

    const parsingResultErrors = jsonElementReaderResult.parsingResult.getBlueprintComparisonErrors();

    const reSerializedJSON: JsonNode = ElementContentHandler.jsonElementWriter.getAsJsonNode(jsonElementReaderResult.element);

    const compareResult = RoundTrip.compare(jsonElementReaderResult, ElementContentHandler.jsonElementWriter);
    const compareResultErrors = compareResult.getBlueprintComparisonErrors();
    const compareResultWarnings = compareResult.getBlueprintComparisonWarnings();

    return {
      parsingResultErrors,
      compareResultErrors,
      compareResultWarnings,
      reSerializedJSON,
    };
  }

  static getYAML(parsedContent: JsonNode): string {
    const jsonElementReaderResult = ElementContentHandler.jsonElementReader.readFromObject(
      parsedContent,
      ChildDeploymentInfo.empty(),
      new JsonPath(),
    );
    return ElementContentHandler.yamlElementWriter.getAsYamlString(jsonElementReaderResult.element);
  }

  static getJSON(parsedContent: JsonNode): JsonNode {
    const jsonElementReaderResult = ElementContentHandler.jsonElementReader.readFromObject(
      parsedContent,
      ChildDeploymentInfo.empty(),
      new JsonPath(),
    );
    return ElementContentHandler.jsonElementWriter.getAsJsonNode(jsonElementReaderResult.element);
  }
}
