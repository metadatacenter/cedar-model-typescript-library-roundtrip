import { SummaryLog } from './SummaryLog';

export class SummaryLogBuilder {
  orderNumber: number;
  type: string;
  UUID: string;
  id: string;
  name: string;
  computedPath: string;
  physicalPath: string;
  parsingErrorCount: number;
  compareErrorCount: number;
  hasException: boolean;

  constructor() {
    this.orderNumber = 0;
    this.type = '';
    this.UUID = '';
    this.id = '';
    this.name = '';
    this.computedPath = '';
    this.physicalPath = '';
    this.parsingErrorCount = 0;
    this.compareErrorCount = 0;
    this.hasException = false;
  }

  withOrderNumber(orderNumber: number): SummaryLogBuilder {
    this.orderNumber = orderNumber;
    return this;
  }

  withType(type: string): SummaryLogBuilder {
    this.type = type;
    return this;
  }

  withUUID(UUID: string): SummaryLogBuilder {
    this.UUID = UUID;
    return this;
  }

  withId(id: string): SummaryLogBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): SummaryLogBuilder {
    this.name = name;
    return this;
  }

  withComputedPath(computedPath: string): SummaryLogBuilder {
    this.computedPath = computedPath;
    return this;
  }

  withPhysicalPath(physicalPath: string): SummaryLogBuilder {
    this.physicalPath = physicalPath;
    return this;
  }

  withParsingErrorCount(parsingErrorCount: number): SummaryLogBuilder {
    this.parsingErrorCount = parsingErrorCount;
    return this;
  }

  withCompareErrorCount(compareErrorCount: number): SummaryLogBuilder {
    this.compareErrorCount = compareErrorCount;
    return this;
  }

  withHasException(hasException: boolean): SummaryLogBuilder {
    this.hasException = hasException;
    return this;
  }

  build(): SummaryLog {
    return new SummaryLog(this);
  }
}
