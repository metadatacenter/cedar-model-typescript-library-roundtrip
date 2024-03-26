export class CedarResource {
  private type: string;
  private id: string;
  private name: string;
  private computedPath: string;
  private physicalPath: string;
  private orderNumber: number;

  public constructor(type: string, id: string, name: string, computedPath: string, physicalPath: string, orderNumber: number) {
    // Update constructor
    this.type = type;
    this.id = id;
    this.name = name;
    this.computedPath = computedPath;
    this.physicalPath = physicalPath;
    this.orderNumber = orderNumber;
  }

  // Add getter for orderNumber
  public getOrderNumber(): number {
    return this.orderNumber;
  }

  public getType(): string {
    return this.type;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getComputedPath(): string {
    return this.computedPath;
  }

  public getPhysicalPath(): string {
    return this.physicalPath;
  }
}
