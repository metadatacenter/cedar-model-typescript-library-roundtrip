import { ComparisonError } from 'cedar-model-typescript-library';

export class ErrorKey {
  private errorType: string;
  private errorPath: string;

  constructor(errorType: string, errorPath: string) {
    this.errorType = errorType;
    this.errorPath = errorPath;
  }

  public toString(): string {
    return `${this.errorType}:${this.errorPath}`;
  }

  public static fromComparisonError(error: ComparisonError): ErrorKey {
    return new ErrorKey(error.errorType.getValue() || '', error.errorPath.toString());
  }

  public static fromComparisonErrorPartial(error: ComparisonError, lastN: number): ErrorKey {
    return new ErrorKey(error.errorType.getValue() || '', error.errorPath.getLastNComponents(lastN).toString());
  }
}
