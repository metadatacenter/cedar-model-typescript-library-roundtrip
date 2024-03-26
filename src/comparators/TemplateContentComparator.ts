import { CedarWriters, ComparisonError, JsonNode, JSONTemplateReader, JSONTemplateWriter } from 'cedar-model-typescript-library';

export class TemplateContentComparator {
  private static templateReader: JSONTemplateReader = JSONTemplateReader.getStrict();

  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const jsonTemplateReaderResult = this.templateReader.readFromObject(parsedContent);

    const parsingResultErrors = jsonTemplateReaderResult.parsingResult.getBlueprintComparisonErrors();

    const writers: CedarWriters = CedarWriters.getStrict();
    const jsonWriter: JSONTemplateWriter = writers.getJSONTemplateWriter();
    const reSerialized: JsonNode = jsonWriter.getAsJsonNode(jsonTemplateReaderResult.template);

    const compareResult = JSONTemplateReader.getRoundTripComparisonResult(jsonTemplateReaderResult, jsonWriter);
    const compareResultErrors = compareResult.getBlueprintComparisonErrors();

    return {
      parsingResultErrors,
      compareResultErrors,
      reSerialized,
    };
  }
}
