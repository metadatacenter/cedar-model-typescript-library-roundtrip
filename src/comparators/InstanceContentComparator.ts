import {
  CedarJSONReaders,
  CedarReaders,
  ComparisonError,
  JsonNode,
  JsonPath,
  JSONTemplateInstanceReader,
} from 'cedar-model-typescript-library';

export class InstanceContentComparator {
  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJSONReaders = CedarReaders.json().getStrict();
    const instanceReader: JSONTemplateInstanceReader = readers.getTemplateInstanceReader();

    const jsonInstanceReaderResult = instanceReader.readFromObject(parsedContent, new JsonPath());

    const parsingResultErrors = jsonInstanceReaderResult.parsingResult.getBlueprintComparisonErrors();

    const compareResultErrors: ComparisonError[] = [];
    const compareResultWarnings: ComparisonError[] = [];
    const reSerialized = {};
    return {
      parsingResultErrors,
      compareResultErrors,
      compareResultWarnings,
      reSerialized,
    };
  }
}
