import {
  CedarJsonReaders,
  CedarReaders,
  ComparisonError,
  JsonNode,
  JsonPath,
  JsonTemplateInstanceReader,
} from 'cedar-model-typescript-library';

export class InstanceContentComparator {
  static compare(parsedContent: any): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerialized: JsonNode;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const instanceReader: JsonTemplateInstanceReader = readers.getTemplateInstanceReader();

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
