import {
  CedarJsonReaders,
  CedarJsonWriters,
  CedarReaders,
  CedarWriters,
  CedarYamlWriters,
  ComparisonError,
  JsonNode,
  JsonTemplateFieldReader,
  JsonTemplateFieldWriter,
  RoundTrip,
} from 'cedar-model-typescript-library';

export class FieldContentHandler {
  static yamlWriters: CedarYamlWriters = CedarWriters.yaml().getStrict();

  static jsonReaders: CedarJsonReaders = CedarReaders.json().getStrict();
  static jsonFieldReader: JsonTemplateFieldReader = FieldContentHandler.jsonReaders.getTemplateFieldReader();

  static jsonWriters: CedarJsonWriters = CedarWriters.json().getStrict();

  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
  } {
    const jsonFieldReaderResult = FieldContentHandler.jsonFieldReader.readFromObject(parsedContent);
    const parsingResultErrors = jsonFieldReaderResult.parsingResult.getBlueprintComparisonErrors();

    const reSerializedJSON: JsonNode = FieldContentHandler.getJSON(parsedContent);
    const jsonWriter: JsonTemplateFieldWriter = FieldContentHandler.jsonWriters.getFieldWriterForField(jsonFieldReaderResult.field);

    const compareResult = RoundTrip.compare(jsonFieldReaderResult, jsonWriter);
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
    const jsonFieldReaderResult = FieldContentHandler.jsonFieldReader.readFromObject(parsedContent);
    const yamlTemplateFieldWriter = FieldContentHandler.yamlWriters.getFieldWriterForField(jsonFieldReaderResult.field);
    return yamlTemplateFieldWriter.getAsYamlString(jsonFieldReaderResult.field);
  }

  static getJSON(parsedContent: JsonNode): JsonNode {
    const jsonFieldReaderResult = FieldContentHandler.jsonFieldReader.readFromObject(parsedContent);
    const jsonWriter: JsonTemplateFieldWriter = FieldContentHandler.jsonWriters.getFieldWriterForField(jsonFieldReaderResult.field);
    return jsonWriter.getAsJsonNode(jsonFieldReaderResult.field);
  }
}
