import OrderItem from "../OrderItem"
import { PercentageDiscountOffer, BuyGetXFreeOffer } from "../offers";

const shampooProduct = {
  name: 'Shampoo',
  variants: [
    {
      name: 'Shampoo (Small)',
      price: 2.00
    },
    {
      name: 'Shampoo (Medium)',
      price: 2.50
    },
    {
      name: 'Shampoo (Large)',
      price: 3.50
    }
  ]
};

describe(("Offers"), () => {
  describe('PercentageDiscountOffer', () => {
    it('returns the correct discount', () => {
      const product = {
        name: 'Sardines',
        price: 1.89
      };
    
      const offers = [
        {
          productName: 'Sardines',
          rule: { percentage: 25 }
        }
      ];
    
      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product, offers });
      const offer = new PercentageDiscountOffer(orderItem.subTotal, [25]);
      const expectedDiscount = 1.42
      expect(offer.discount().toNumber()).toEqual(expectedDiscount);
    });

    it('returns the highest discount', () => {
      const product = {
        name: 'Sardines',
        price: 1.89
      };
    
      const offers = [
        {
          productName: 'Sardines',
          rule: { percentage: 25 }
        },
        {
          productName: 'Sardines',
          rule: { percentage: 35 }
        }
      ];
    
      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product, offers });
      const offer = new PercentageDiscountOffer(orderItem.subTotal, [25, 35]);
      const expectedDiscount = 1.99
      expect(offer.discount().toNumber()).toEqual(expectedDiscount);
    });
  });

  describe('BuyGetXFreeOffer', () => {
    it('returns the correct discount', () => {
      const offers = [
        {
          productName: 'Baked Beans',
          rule: { buyQuantity: 2, freeQuantity: 1 }
        },
      ];
  
      const product = {
        name: 'Baked Beans',
        price: 0.99
      };
      const orderItem = new OrderItem({ productName: product.name, quantity: 4, product, offers });
      const offer = new BuyGetXFreeOffer(
        orderItem.quantity,
        orderItem.price,
        [{ buyQuantity: 2, freeQuantity: 1 }],
      );
      const expectedDiscount = 1.98
      expect(offer.discount().toNumber()).toEqual(expectedDiscount);
    });

    it('returns the correct discount for buy x variant free offer', () => {
      const offers = [
        {
          productName: 'Shampoo (Large)',
          rule: { buyQuantity: 3, freeQuantity: 1, freeVariant: 'Shampoo (Small)' }
        },
      ];
      const product = {
        name: 'Shampoo (Large)',
        price: 3.50
      };
      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct, variant: product, offers });
      const offer = new BuyGetXFreeOffer(
        orderItem.quantity,
        orderItem.price,
        [{ buyQuantity: 3, freeQuantity: 1, freeVariant: 'Shampoo (Small)' }],
        shampooProduct.variants,
      );
      const expectedDiscount = 2.00
      expect(offer.discount().toNumber()).toEqual(expectedDiscount);
    });
  });
});