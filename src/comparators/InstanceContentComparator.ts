import {
  CedarJsonReaders,
  CedarReaders,
  ComparisonError,
  JsonNode,
  JsonPath,
  JsonTemplateInstanceReader,
} from 'cedar-model-typescript-library';

export class InstanceContentComparator {
  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
    reSerializedYAML: string;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const instanceReader: JsonTemplateInstanceReader = readers.getTemplateInstanceReader();

    const jsonInstanceReaderResult = instanceReader.readFromObject(parsedContent, new JsonPath());

    const parsingResultErrors = jsonInstanceReaderResult.parsingResult.getBlueprintComparisonErrors();

    const compareResultErrors: ComparisonError[] = [];
    const compareResultWarnings: ComparisonError[] = [];
    const reSerializedJSON = jsonInstanceReaderResult.instanceSourceObject;
    const reSerializedYAML: string = '';
    return {
      parsingResultErrors,
      compareResultErrors,
      compareResultWarnings,
      reSerializedJSON,
      reSerializedYAML,
    };
  }
}
