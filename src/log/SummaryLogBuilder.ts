import { SummaryLog } from './SummaryLog';

export class SummaryLogBuilder {
  orderNumber: number;
  type: string;
  uuid: string;
  id: string;
  name: string;
  computedPath: string;
  physicalPath: string;
  parsingErrorCount: number;
  compareErrorCount: number;
  compareWarningCount: number;
  hasException: boolean;
  createdOn: string;
  lastUpdatedOn: string;
  createdBy: string;
  isCSV2CEDAR: boolean;

  constructor() {
    this.orderNumber = 0;
    this.type = '';
    this.uuid = '';
    this.id = '';
    this.name = '';
    this.computedPath = '';
    this.physicalPath = '';
    this.parsingErrorCount = 0;
    this.compareErrorCount = 0;
    this.compareWarningCount = 0;
    this.hasException = false;
    this.createdOn = '';
    this.lastUpdatedOn = '';
    this.createdBy = '';
    this.isCSV2CEDAR = false;
  }

  withOrderNumber(orderNumber: number): SummaryLogBuilder {
    this.orderNumber = orderNumber;
    return this;
  }

  withType(type: string): SummaryLogBuilder {
    this.type = type;
    return this;
  }

  withUuid(uuid: string): SummaryLogBuilder {
    this.uuid = uuid;
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

  withCompareWarningCount(compareWarningCount: number): SummaryLogBuilder {
    this.compareWarningCount = compareWarningCount;
    return this;
  }

  withHasException(hasException: boolean): SummaryLogBuilder {
    this.hasException = hasException;
    return this;
  }

  withCreatedOn(createdOn: string): SummaryLogBuilder {
    this.createdOn = createdOn;
    return this;
  }

  withLastUpdatedOn(lastUpdatedOn: string): SummaryLogBuilder {
    this.lastUpdatedOn = lastUpdatedOn;
    return this;
  }

  withCreatedBy(createdBy: string): SummaryLogBuilder {
    this.createdBy = createdBy;
    return this;
  }

  withCSV2CEDAR(isCSV2CEDAR: boolean): SummaryLogBuilder {
    this.isCSV2CEDAR = isCSV2CEDAR;
    return this;
  }

  build(): SummaryLog {
    return new SummaryLog(this);
  }
}
