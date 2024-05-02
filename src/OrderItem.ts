import { Product, ProductVariant, Offer, BuyOffer } from './types';
import { Decimal } from 'decimal.js';
import { BuyGetXFreeOffer, PercentageDiscountOffer } from './offers';

Decimal.set({ precision: 3, rounding: Decimal.ROUND_UP });


interface IOrderItem {
  productName: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant | null;
  offers?: Offer[];
}

export default class OrderItem {
  productName: string;

  quantity: number;

  product: Product;

  discount: Decimal = new Decimal(0.00);

  variant?: ProductVariant | null;

  offers?: Offer[] = []

  constructor({productName, quantity, product, variant, offers }: IOrderItem){
    if (quantity < 1) {
      throw new Error('Quantity must be greater than or equal to 1.')
    }

    if (!variant?.price && !product.price) {
      throw new Error('Either product or variant must have a price');
    }

    this.productName = productName;
    this.quantity = quantity;
    this.product = product;
    this.variant = variant;
    this.offers = offers;

    this.setDiscount();
  }

  get price(): Decimal {
    if (this.variant) {
      return new Decimal(this.variant.price);
    }

    if (!this.product.price) {
      throw new Error('Product must have a price if no variant is provided.')
    }
    return new Decimal(this.product!.price);
  }

  get subTotal(): Decimal {
    return this.price.times(this.quantity);
  }

  get total(): Decimal {
    return this.subTotal.minus(this.discount);
  }

  private getPercentageOffers(): number[] {
    return this.offers?.reduce((acc: number[], offer: Offer) => {
      if ('percentage' in offer.rule) {
        acc.push(offer.rule.percentage);
      }
      return acc;
    }, []) ?? [];
  }

  private getBuyXOffers(): BuyOffer[] {
    return this.offers?.reduce((acc: BuyOffer[], offer: Offer) => {
      if (!('percentage' in offer.rule)) {
        acc.push(offer.rule);
      }
      return acc;
    }, []) ?? [];
  }

  setDiscount() {
    const percentageOffers = this.getPercentageOffers();
    const buyXOffers = this.getBuyXOffers();

    let percentageDiscount = new Decimal(0.00);
    let buyXOfferDiscount = new Decimal(0.00);

    if (percentageOffers.length > 0) {
      percentageDiscount = new PercentageDiscountOffer(this.subTotal, percentageOffers).discount();
    }

    if (buyXOffers.length > 0) {
      buyXOfferDiscount = new BuyGetXFreeOffer(this.quantity, this.price, buyXOffers, this.product?.variants).discount();
    }
    this.discount = percentageDiscount.greaterThan(buyXOfferDiscount) ? percentageDiscount : buyXOfferDiscount;
  }
}
