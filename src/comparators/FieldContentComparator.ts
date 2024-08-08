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
  YamlTemplateFieldWriter,
} from 'cedar-model-typescript-library';

export class FieldContentComparator {
  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
    reSerializedYAML: string;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const fieldReader: JsonTemplateFieldReader = readers.getTemplateFieldReader();

    const jsonFieldReaderResult = fieldReader.readFromObject(parsedContent);

    const parsingResultErrors = jsonFieldReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJsonWriters = CedarWriters.json().getStrict();
    const jsonWriter: JsonTemplateFieldWriter = writers.getFieldWriterForField(jsonFieldReaderResult.field);
    const reSerializedJSON: JsonNode = jsonWriter.getAsJsonNode(jsonFieldReaderResult.field);

    const yamlWriters: CedarYamlWriters = CedarWriters.yaml().getStrict();
    const yamlWriter: YamlTemplateFieldWriter = yamlWriters.getFieldWriterForField(jsonFieldReaderResult.field);
    const reSerializedYAML: string = yamlWriter.getAsYamlString(jsonFieldReaderResult.field);

    const compareResult = RoundTrip.compare(jsonFieldReaderResult, jsonWriter);
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
