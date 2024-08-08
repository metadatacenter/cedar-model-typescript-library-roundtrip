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

export class ElementContentComparator {
  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
    reSerializedYAML: string;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const elementReader: JsonTemplateElementReader = readers.getTemplateElementReader();

    const jsonElementReaderResult = elementReader.readFromObject(parsedContent, ChildDeploymentInfo.empty(), new JsonPath());

    const parsingResultErrors = jsonElementReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJsonWriters = CedarWriters.json().getStrict();
    const jsonWriter: JsonTemplateElementWriter = writers.getTemplateElementWriter();
    const reSerializedJSON: JsonNode = jsonWriter.getAsJsonNode(jsonElementReaderResult.element);

    const yamlWriters: CedarYamlWriters = CedarWriters.yaml().getStrict();
    const yamlWriter: YamlTemplateElementWriter = yamlWriters.getTemplateElementWriter();
    const reSerializedYAML: string = yamlWriter.getAsYamlString(jsonElementReaderResult.element);

    const compareResult = RoundTrip.compare(jsonElementReaderResult, jsonWriter);
    const compareResultErrors = compareResult.getBlueprintComparisonErrors();
    const compareResultWarnings = compareResult.getBlueprintComparisonWarnings();

    return {
      parsingResultErrors,
      compareResultErrors,
      compareResultWarnings,
      reSerializedJSON,
      reSerializedYAML,
    };
  }
}
