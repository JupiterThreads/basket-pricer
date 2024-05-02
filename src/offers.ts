import { BuyOffer, ProductVariant } from './types';
import Decimal from 'decimal.js';

Decimal.set({ precision: 3, rounding: Decimal.ROUND_UP });


interface Offer {
    discount(): Decimal;
}

export class PercentageDiscountOffer implements Offer {

    constructor(private subTotal: Decimal, private percentages: number[]) {}

    discount(): Decimal {
        const maxPercentage = this.percentages.length > 0 ? Math.max(...this.percentages) : null;
        if (maxPercentage) {
            return this.subTotal.dividedBy(100).times(maxPercentage);
        }
        return new Decimal(0);
    }
}

export class BuyGetXFreeOffer implements Offer {
  constructor(
    private itemQuantity: number, 
    private itemPrice: Decimal, 
    private buyOffers: BuyOffer[], 
    private productVariants?: ProductVariant[]) {}

  get buyGetFreeOffers() {
    return this.buyOffers.filter((buyOffer) => !buyOffer.freeVariant);
  }

  get buyGetVariantOffers() {
    return this.buyOffers.filter((buyOffer) => !!buyOffer.freeVariant);
  }

  private calculateXFree(buyQuantity: number, freeQuantity: number, quantity: number): number {
    const qualifiedQuantity = Math.floor(quantity/buyQuantity);
    return qualifiedQuantity * freeQuantity;
  }

  get buyGetFreeOfferDiscount(): Decimal {
    let numFree = 0;
    this.buyGetFreeOffers.forEach((buyOffer) => {
      const xFree = this.calculateXFree(buyOffer.buyQuantity, buyOffer.freeQuantity, this.itemQuantity);
      if (xFree > numFree) {
        numFree = xFree;
      }
    });
    return this.itemPrice.times(numFree);
  }

  get buyGetVariantFreeOfferDiscount(): Decimal {
    let discount = new Decimal(0.00);
    this.buyGetVariantOffers.forEach((buyOffer) => {
      const xFree = this.calculateXFree(buyOffer.buyQuantity, buyOffer.freeQuantity, this.itemQuantity);
      const variant = this.productVariants?.find((prod) => prod.name === buyOffer.freeVariant!);
      if (!variant) return;
      const price = new Decimal(variant.price).times(xFree);
      if (price.greaterThan(discount)) {
        discount = price;
      }
    });
    return discount;
  }

  discount(): Decimal {
    const variantFreeOffer = this.buyGetVariantFreeOfferDiscount;
    const buyGetFreeOffer = this.buyGetFreeOfferDiscount;
    return variantFreeOffer.greaterThan(buyGetFreeOffer) ? variantFreeOffer : buyGetFreeOffer;  
  }
}
