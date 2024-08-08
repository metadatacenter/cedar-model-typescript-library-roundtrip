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

export class TemplateContentComparator {
  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
    reSerializedYAML: string;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const templateReader: JsonTemplateReader = readers.getTemplateReader();

    const jsonTemplateReaderResult = templateReader.readFromObject(parsedContent);

    const parsingResultErrors = jsonTemplateReaderResult.parsingResult.getBlueprintComparisonErrors();

    const jsonWriters: CedarJsonWriters = CedarWriters.json().getStrict();
    const jsonWriter: JsonTemplateWriter = jsonWriters.getTemplateWriter();
    const reSerializedJSON: JsonNode = jsonWriter.getAsJsonNode(jsonTemplateReaderResult.template);

    const yamlWriters: CedarYamlWriters = CedarWriters.yaml().getStrict();
    const yamlWriter: YamlTemplateWriter = yamlWriters.getTemplateWriter();
    const reSerializedYAML: string = yamlWriter.getAsYamlString(jsonTemplateReaderResult.template);

    const compareResult = RoundTrip.compare(jsonTemplateReaderResult, jsonWriter);
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
