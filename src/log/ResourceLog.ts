import { ComparisonError, JsonNode } from 'cedar-model-typescript-library';
import { ResourceLogBuilder } from './ResourceLogBuilder';

export class ResourceLog {
  orderNumber: number;
  type: string;
  UUID: string = '';
  id: string;
  name: string;
  computedPath: string;
  physicalPath: string;
  parsingErrorCount: number = 0;
  compareErrorCount: number = 0;
  compareWarningCount: number = 0;
  parsingErrors: ComparisonError[];
  compareResultErrors: ComparisonError[];
  compareResultWarnings: ComparisonError[];
  exception: Error | null;
  sourceJSON: JsonNode;
  targetJSON: JsonNode;

  constructor(builder: ResourceLogBuilder) {
    this.orderNumber = builder.orderNumber;
    this.type = builder.type;
    this.id = builder.id;
    this.name = builder.name;
    this.computedPath = builder.computedPath;
    this.physicalPath = builder.physicalPath;
    this.parsingErrors = builder.parsingErrors;
    this.compareResultErrors = builder.compareResultErrors;
    this.compareResultWarnings = builder.compareResultWarnings;
    this.exception = builder.exception;
    this.sourceJSON = builder.sourceJSON;
    this.targetJSON = builder.targetJSON;
  }
}
