import {
  CedarJsonReaders,
  CedarReaders,
  ComparisonError,
  JsonNode,
  JsonPath,
  JsonTemplateInstanceReader,
} from 'cedar-model-typescript-library';

export class InstanceContentHandler {
  static compare(parsedContent: JsonNode): {
    parsingResultErrors: ComparisonError[];
    compareResultErrors: ComparisonError[];
    compareResultWarnings: ComparisonError[];
    reSerializedJSON: JsonNode;
  } {
    const readers: CedarJsonReaders = CedarReaders.json().getStrict();
    const instanceReader: JsonTemplateInstanceReader = readers.getTemplateInstanceReader();

    const jsonInstanceReaderResult = instanceReader.readFromObject(parsedContent, new JsonPath());

    const parsingResultErrors = jsonInstanceReaderResult.parsingResult.getBlueprintComparisonErrors();

    const compareResultErrors: ComparisonError[] = [];
    const compareResultWarnings: ComparisonError[] = [];
    const reSerializedJSON = jsonInstanceReaderResult.instanceSourceObject;
    return {
      parsingResultErrors,
      compareResultErrors,
      compareResultWarnings,
      reSerializedJSON,
    };
  }

  static getYAML(_parsedContent: JsonNode): string | null {
    return null;
  }

  static getJSON(_parsedContent: JsonNode): JsonNode | null {
    return null;
  }
}
