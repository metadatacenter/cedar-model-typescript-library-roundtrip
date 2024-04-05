import {
  CedarJsonReaders,
  CedarJsonWriters,
  CedarReaders,
  CedarWriters,
  ComparisonError,
  JsonNode,
  JsonTemplateReader,
  JsonTemplateWriter,
  RoundTrip,
} from 'cedar-model-typescript-library';

export class TemplateContentComparator {
  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const templateReader: JsonTemplateReader = readers.getTemplateReader();

    const jsonTemplateReaderResult = templateReader.readFromObject(parsedContent);

    const parsingResultErrors = jsonTemplateReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJsonWriters = CedarWriters.json().getStrict();
    const jsonWriter: JsonTemplateWriter = writers.getTemplateWriter();
    const reSerialized: JsonNode = jsonWriter.getAsJsonNode(jsonTemplateReaderResult.template);

    const compareResult = RoundTrip.compare(jsonTemplateReaderResult, jsonWriter);
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
