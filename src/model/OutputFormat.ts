export const OutputFormatValues = {
  JSON: 'JSON',
  YAML: 'YAML',
  LOG: 'LOG',
} as const;

export type OutputFormatValue = (typeof OutputFormatValues)[keyof typeof OutputFormatValues] | null;

export class OutputFormat {
  private readonly value: OutputFormatValue | null;

  private constructor(value: OutputFormatValue) {
    this.value = value;
  }

  public getValue(): OutputFormatValue {
    return this.value;
  }

  public static values(): OutputFormat[] {
    return [OutputFormat.JSON, OutputFormat.YAML, OutputFormat.LOG];
  }

  public static JSON = new OutputFormat(OutputFormatValues.JSON);
  public static YAML = new OutputFormat(OutputFormatValues.YAML);
  public static LOG = new OutputFormat(OutputFormatValues.LOG);

  public static NULL = new OutputFormat(null);
}
