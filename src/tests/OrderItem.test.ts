import OrderItem from '../OrderItem';

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

describe('OrderItem', () => {
  
  it('calculates sub total', () => {
    const product = {
      name: 'Biscuits',
      price: 1.20
    };
    const orderItem = new OrderItem({ productName: product.name, quantity: 2, product });
    const expectedSubTotal = 2.40;
    expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
  });

  it('calculates total', () => {
    const product = {
      name: 'Baked Beans',
      price: 0.99
    };
    const orderItem = new OrderItem({ productName: product.name, quantity: 3, product });
    const expectedTotal = 2.97;
    expect(orderItem.total.toNumber()).toEqual(expectedTotal);
  });

  it('gets price', () => {
    const product = {
      name: 'Sardines',
      price: 1.89
    };
    const orderItem = new OrderItem({ productName: product.name, quantity: 3, product });
    expect(orderItem.price.toNumber()).toEqual(product.price);
  });

  it('discounts the percentage offer', () => {
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

    const expectedTotal = 4.25;
    const expectedSubTotal = 5.67;
    const expectedDiscount = 1.42;

    expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
    expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
    expect(orderItem.total.toNumber()).toEqual(expectedTotal);
  });

  it('discounts the buy x free offer', () => {
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
    const expectedTotal = 1.98;
    const expectedSubTotal = 3.96;
    const expectedDiscount = 1.98;

    expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
    expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
    expect(orderItem.total.toNumber()).toEqual(expectedTotal);
  });

  it('discounts the great of the buy x free offer', () => {
    const offers = [
      {
        productName: 'Baked Beans',
        rule: { buyQuantity: 2, freeQuantity: 1 }
      },
      {
        productName: 'Baked Beans',
        rule: { buyQuantity: 3, freeQuantity: 1 }
      },
    ];

    const product = {
      name: 'Baked Beans',
      price: 0.99
    };

    const orderItem = new OrderItem({ productName: product.name, quantity: 4, product, offers });
    const expectedTotal = 1.98;
    const expectedSubTotal = 3.96;
    const expectedDiscount = 1.98;

    expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
    expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
    expect(orderItem.total.toNumber()).toEqual(expectedTotal);
  });

  describe('Product variants', () => {

    it('raises error if no price provided', () => {
      const product = {
        name: 'Shampoo (Medium)',
        price: 2.50
      };
      expect(() => {
        new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct });
      }).toThrow('Either product or variant must have a price');
    });

    it('gets price of variant', () => {
      const product = {
        name: 'Shampoo (Medium)',
        price: 2.50
      };
      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct, variant: product });
      expect(orderItem.price.toNumber()).toEqual(product.price);
    });

    it('calculates sub total', () => {
      const product = {
        name: 'Shampoo (Small)',
        price: 2.00
      };
      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct, variant: product });
      const expectedSubTotal = 6.00;
      expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
    });

    it('calculates total', () => {
      const product = {
        name: 'Shampoo (Large)',
        price: 3.50
      };
      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct, variant: product });
      const expectedTotal = 10.50;
      expect(orderItem.total.toNumber()).toEqual(expectedTotal);
    });

    it('discounts percentage offers', () => {
      const offers = [
        {
          productName: 'Shampoo (Medium)',
          rule: { percentage: 15 }
        }
      ];
      const product = {
        name: 'Shampoo (Medium)',
        price: 2.50
      };

      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct, variant: product, offers });

      const expectedTotal = 6.37;
      const expectedSubTotal = 7.50;
      const expectedDiscount = 1.13;
  
      expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
      expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
      expect(orderItem.total.toNumber()).toEqual(expectedTotal);
    });

    it('discounts greater percentage offer', () => {
      const offers = [
        {
          productName: 'Shampoo (Medium)',
          rule: { percentage: 15 }
        },
        {
          productName: 'Shampoo (Medium)',
          rule: { percentage: 25 }
        }
      ];
      const product = {
        name: 'Shampoo (Medium)',
        price: 2.50
      };

      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct, variant: product, offers });

      const expectedTotal = 5.62;
      const expectedSubTotal = 7.50;
      const expectedDiscount = 1.88;
  
      expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
      expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
      expect(orderItem.total.toNumber()).toEqual(expectedTotal);
    });

    it('discounts the buy x variant free offer', () => {
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
      const expectedTotal = 8.50;
      const expectedSubTotal = 10.50;
      const expectedDiscount = 2.00;
  
      expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
      expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
      expect(orderItem.total.toNumber()).toEqual(expectedTotal);
    });

    it('discounts the greater of the buy x variant free offer', () => {
      const offers = [
        {
          productName: 'Shampoo (Large)',
          rule: { buyQuantity: 3, freeQuantity: 1, freeVariant: 'Shampoo (Small)' }
        },
        {
          productName: 'Shampoo (Large)',
          rule: { buyQuantity: 4, freeQuantity: 2 }
        },
      ];

      const product = {
        name: 'Shampoo (Large)',
        price: 3.50
      };

      const orderItem = new OrderItem({ productName: product.name, quantity: 5, product: shampooProduct, variant: product, offers });
      const expectedTotal = 10.50;
      const expectedSubTotal = 17.50;
      const expectedDiscount = 7.00;
  
      expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
      expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
      expect(orderItem.total.toNumber()).toEqual(expectedTotal);
    });

    it('discounts the greater of the percentage over the buy x free offer', () => {
      const offers = [
        {
          productName: 'Shampoo (Large)',
          rule: { buyQuantity: 3, freeQuantity: 1, freeVariant: 'Shampoo (Small)' }
        },
        {
          productName: 'Shampoo (Large)',
          rule: { percentage: 50 }
        },
      ];

      const product = {
        name: 'Shampoo (Large)',
        price: 3.50
      };

      const orderItem = new OrderItem({ productName: product.name, quantity: 3, product: shampooProduct, variant: product, offers });
      const expectedTotal = 5.25;
      const expectedSubTotal = 10.50;
      const expectedDiscount = 5.25;
  
      expect(orderItem.subTotal.toNumber()).toEqual(expectedSubTotal);
      expect(orderItem.discount.toNumber()).toEqual(expectedDiscount);
      expect(orderItem.total.toNumber()).toEqual(expectedTotal);
    });
  });
});