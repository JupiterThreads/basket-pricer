import Decimal from "decimal.js";
import { Catalogue, Offer, Basket, BasketItem, CurrencyOptions } from "./types";
import { requestSchema } from './schemas.ts';
import OrderItem from "./OrderItem.ts";

Decimal.set({ precision: 3, rounding: Decimal.ROUND_UP });

const defaultLocale = 'en-GB';
const defaultCurrency = 'GBP';

export default class BasketPricerService {
  
  _subTotal: Decimal = new Decimal(0);
  
  _discount: Decimal = new Decimal(0);

  _total: Decimal = new Decimal(0);

  basket: Basket | null = null;

  catalogue: Catalogue | null = null;

  offers: Offer[] = [];

  orderItems: OrderItem[] = [];

  currencyOptions?: CurrencyOptions;

  constructor(requestData: any) {
    const parsedData = requestSchema.parse(requestData);
    this.basket = parsedData.basket;
    this.offers = parsedData.offers ?? [];
    this.catalogue = parsedData.catalogue;
    this.currencyOptions = parsedData.currencySchema;

    this.orderItems = this.createOrderItems();

    this._subTotal = this.calculate('subTotal');
    this._total = this.calculate('total');
    this._discount = this.calculate('discount');
  }

  get subTotal(): string {
    return this.formatResult(this._subTotal.toNumber());
  }

  get total(): string {
    return this.formatResult(this._total.toNumber());
  }

  get discount(): string {
    return this.formatResult(this._discount.toNumber());
  }

  private formatResult(value: number): string {
    if (this.currencyOptions) {
      return new Intl.NumberFormat(this.currencyOptions.locale, { style: 'currency', currency: this.currencyOptions.currency }).format(value);
    }
    return new Intl.NumberFormat(defaultLocale, { style: 'currency', currency: defaultCurrency }).format(value);
  }

  private getProductAndVariantFromCatalogue(productName: string): Record<string, any> {
    let product = null;
    let variant = null;
    if (this.catalogue == null) return { product, variant };

    for (const prod of this.catalogue) {
      if (productName == prod.name) {
        product = prod;
        break;
      }
      if (prod.variants) {
        const foundVar = prod.variants.find((obj) => obj.name == productName);
        if (foundVar) {
          variant = foundVar;
          product = prod;
          break;
        }
      }
    }
    return {
      product,
      variant,
    };
  }

  private createOrderItems(): OrderItem[] {
    return this.basket?.reduce((acc: OrderItem[], item: BasketItem) => {
      if (!item.name || !item.quantity) return acc;
      const { product, variant } = this.getProductAndVariantFromCatalogue(item.name);
      if (!product) return acc;

      let offers = this.getProductOffers(product.name);
      if (variant) {
        offers = [...offers, ...this.getProductOffers(variant.name)];
      }

      acc.push(new OrderItem({ 
        productName: item.name, 
        quantity: item.quantity, 
        variant, 
        product, 
        offers,
      }))
      return acc;
    }, []) ?? [];
  }

  private getProductOffers(productName: string): Offer[] {
    return this.offers.filter((offer) => offer.productName === productName);
  }

  private calculate(key: string): Decimal {
    return this.orderItems.reduce((acc: Decimal, item: OrderItem) => {
      const total = acc.plus((item as any)[key]);
      return total;
    }, new Decimal(0));
  }
}