export class Config {
  private readonly cedarHome: string;

  private constructor(cedarHome: string) {
    this.cedarHome = cedarHome;
  }

  public getCedarHome(): string {
    return this.cedarHome;
  }

  static get(): Config {
    if (!process.env.CEDAR_HOME) {
      throw new Error('CEDAR_HOME environment variable is not set.');
    }
    return new Config(process.env.CEDAR_HOME);
  }
}
