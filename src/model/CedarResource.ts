export class CedarResource {
  private readonly type: string;
  private readonly id: string;
  private readonly name: string;
  private readonly computedPath: string;
  private readonly physicalPath: string;
  private readonly orderNumber: number;

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
