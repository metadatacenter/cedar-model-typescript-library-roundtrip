import {
  CedarJSONReaders,
  CedarJSONWriters,
  CedarReaders,
  CedarWriters,
  ComparisonError,
  JsonNode,
  JSONTemplateReader,
  JSONTemplateWriter,
  RoundTrip,
} from 'cedar-model-typescript-library';

export class TemplateContentComparator {
  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJSONReaders = CedarReaders.json().getStrict();
    const templateReader: JSONTemplateReader = readers.getTemplateReader();

    const jsonTemplateReaderResult = templateReader.readFromObject(parsedContent);

    const parsingResultErrors = jsonTemplateReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarJSONWriters = CedarWriters.json().getFebruary2024();
    const jsonWriter: JSONTemplateWriter = writers.getJSONTemplateWriter();
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
