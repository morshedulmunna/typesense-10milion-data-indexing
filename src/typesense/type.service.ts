export abstract class PricingService {
  public calculator() {
    return '';
  }
}

export class RegularPricingStrategy implements PricingService {
  public calculator(): string {
    throw new Error('Method not implemented.');
  }

  public fetchInternalPricing(): void {}
}
