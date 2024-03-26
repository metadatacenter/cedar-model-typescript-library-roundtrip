import { ComparisonError, JsonNode } from 'cedar-model-typescript-library';
import { ResourceLog } from './ResourceLog';

export class ResourceLogBuilder {
  orderNumber: number = -1;
  type: string = '';
  id: string = '';
  name: string = '';
  computedPath: string = '';
  physicalPath: string = '';
  parsingErrors: ComparisonError[] = [];
  compareResultErrors: ComparisonError[] = [];
  exception: Error | null = null;
  sourceJSON: JsonNode = {};
  targetJSON: JsonNode = {};

  static withOrderNumber(orderNumber: number): ResourceLogBuilder {
    const builder = new ResourceLogBuilder();
    builder.orderNumber = orderNumber;
    return builder;
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
