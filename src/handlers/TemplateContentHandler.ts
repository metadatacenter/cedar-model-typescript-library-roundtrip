import {
  CedarJsonReaders,
  CedarJsonWriters,
  CedarReaders,
  CedarWriters,
  CedarYamlWriters,
  ComparisonError,
  JsonNode,
  JsonTemplateReader,
  JsonTemplateWriter,
  RoundTrip,
  YamlTemplateWriter,
} from 'cedar-model-typescript-library';

export class TemplateContentHandler {
  static jsonReaders: CedarJsonReaders = CedarReaders.json().getStrict();
  static jsonTemplateReader: JsonTemplateReader = TemplateContentHandler.jsonReaders.getTemplateReader();

  static yamlWriters: CedarYamlWriters = CedarWriters.yaml().getStrict();
  static yamlTemplateWriter: YamlTemplateWriter = TemplateContentHandler.yamlWriters.getTemplateWriter();

  static jsonWriters: CedarJsonWriters = CedarWriters.json().getStrict();
  static jsonTemplateWriter: JsonTemplateWriter = TemplateContentHandler.jsonWriters.getTemplateWriter();

  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
  } {
    const jsonTemplateReaderResult = TemplateContentHandler.jsonTemplateReader.readFromObject(parsedContent);

    const parsingResultErrors = jsonTemplateReaderResult.parsingResult.getBlueprintComparisonErrors();

    const reSerializedJSON: JsonNode = TemplateContentHandler.jsonTemplateWriter.getAsJsonNode(jsonTemplateReaderResult.template);

    const compareResult = RoundTrip.compare(jsonTemplateReaderResult, TemplateContentHandler.jsonTemplateWriter);
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
    const jsonTemplateReaderResult = TemplateContentHandler.jsonTemplateReader.readFromObject(parsedContent);
    return TemplateContentHandler.yamlTemplateWriter.getAsYamlString(jsonTemplateReaderResult.template);
  }

  static getJSON(parsedContent: JsonNode): JsonNode {
    const jsonTemplateReaderResult = TemplateContentHandler.jsonTemplateReader.readFromObject(parsedContent);
    return TemplateContentHandler.jsonTemplateWriter.getAsJsonNode(jsonTemplateReaderResult.template);
  }
}
