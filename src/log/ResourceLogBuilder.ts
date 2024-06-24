import { ComparisonError, JsonNode } from 'cedar-model-typescript-library';
import { ResourceLog } from './ResourceLog';

export class ResourceLogBuilder {
  orderNumber: number;
  type: string;
  id: string;
  name: string;
  computedPath: string;
  physicalPath: string;
  parsingErrors: ComparisonError[];
  compareResultErrors: ComparisonError[];
  compareResultWarnings: ComparisonError[];
  exception: Error | null;
  sourceJSON: JsonNode;
  targetJSON: JsonNode;

  constructor() {
    this.orderNumber = -1;
    this.type = '';
    this.id = '';
    this.name = '';
    this.computedPath = '';
    this.physicalPath = '';
    this.parsingErrors = [];
    this.compareResultErrors = [];
    this.compareResultWarnings = [];
    this.exception = null;
    this.sourceJSON = {};
    this.targetJSON = {};
  }

  withOrderNumber(orderNumber: number): ResourceLogBuilder {
    this.orderNumber = orderNumber;
    return this;
  }

  withType(type: string): ResourceLogBuilder {
    this.type = type;
    return this;
  }

  withId(id: string): ResourceLogBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): ResourceLogBuilder {
    this.name = name;
    return this;
  }

  withComputedPath(computedPath: string): ResourceLogBuilder {
    this.computedPath = computedPath;
    return this;
  }

  withPhysicalPath(physicalPath: string): ResourceLogBuilder {
    this.physicalPath = physicalPath;
    return this;
  }

  withParsingErrors(parsingErrors: ComparisonError[]): ResourceLogBuilder {
    this.parsingErrors = parsingErrors;
    return this;
  }

  withCompareResultErrors(compareResultErrors: ComparisonError[]): ResourceLogBuilder {
    this.compareResultErrors = compareResultErrors;
    return this;
  }

  withCompareResultWarnings(compareResultWarnings: ComparisonError[]): ResourceLogBuilder {
    this.compareResultWarnings = compareResultWarnings;
    return this;
  }

  withException(exception: Error | null): ResourceLogBuilder {
    this.exception = exception;
    return this;
  }

  withSourceJSON(sourceJSON: JsonNode): ResourceLogBuilder {
    this.sourceJSON = sourceJSON;
    return this;
  }

  withTargetJSON(targetJSON: JsonNode): ResourceLogBuilder {
    this.targetJSON = targetJSON;
    return this;
  }

  build(): ResourceLog {
    return new ResourceLog(this);
  }
}
