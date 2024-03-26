import { SummaryLogBuilder } from './SummaryLogBuilder';

export class SummaryLog {
  orderNumber: number;
  type: string;
  UUID: string = '';
  id: string;
  name: string;
  computedPath: string;
  physicalPath: string;
  parsingErrorCount: number = 0;
  compareErrorCount: number = 0;
  hasException: boolean;

  constructor(builder: SummaryLogBuilder) {
    this.orderNumber = builder.orderNumber;
    this.type = builder.type;
    this.UUID = builder.UUID;
    this.id = builder.id;
    this.name = builder.name;
    this.computedPath = builder.computedPath;
    this.physicalPath = builder.physicalPath;
    this.parsingErrorCount = builder.parsingErrorCount;
    this.compareErrorCount = builder.compareErrorCount;
    this.hasException = builder.hasException;
  }
}
