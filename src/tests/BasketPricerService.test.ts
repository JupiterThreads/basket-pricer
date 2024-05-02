import { BasketItem } from '../types';
import BasketPricerService from '../BasketPricerService';

const catalogue = [
  {
    name: 'Baked Beans',
    price: 0.99,
  },
  {
    name: 'Biscuits',
    price: 1.20
  },
  {
    name: 'Sardines',
    price: 1.89
  },
  {
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
  }
];

describe('BasketPricerService', () => {
  it('returns correct totals and discount', () => {
    const basket = [
      {
        name: 'Baked Beans',
        quantity: 2,
      },
      {
        name: 'Biscuits',
        quantity: 1,
      },
      {
        name: 'Shampoo (Medium)',
        quantity: 1
      }
    ];
    const pricerService = new BasketPricerService({ catalogue, basket });

    const expectedTotal = '£5.68';
    const expectedDiscount = '£0.00';
    const expectedSubTotal = '£5.68';
    
    expect(pricerService.subTotal).toEqual(expectedSubTotal);
    expect(pricerService.discount).toEqual(expectedDiscount);
    expect(pricerService.total).toEqual(expectedTotal);
  });

  it('returns correct totals and discount for empty basket', () => {
    const basket = [] as BasketItem[];
    const pricerService = new BasketPricerService({ catalogue, basket });

    const expectedTotal = '£0.00';
    const expectedDiscount = '£0.00';
    const expectedSubTotal = '£0.00';
    
    expect(pricerService.subTotal).toEqual(expectedSubTotal);
    expect(pricerService.discount).toEqual(expectedDiscount);
    expect(pricerService.total).toEqual(expectedTotal);
  });

  it('applies buy one get one free offer', () => {
    const offers = [
      {
        productName: 'Baked Beans',
        rule: { buyQuantity: 2, freeQuantity: 1 }
      },
      { 
        productName: 'Sardines',
        rule: { percentage: 25 }
      }
    ];

    const basket = [
      {
        name: 'Baked Beans',
        quantity: 4,
      },
      {
        name: 'Biscuits',
        quantity: 1,
      },
    ];

    const pricerService = new BasketPricerService({ catalogue, basket, offers });
    const expectedSubTotal = '£5.16';
    const expectedTotal = '£3.18';
    const expectedDiscount = '£1.98';
    
    expect(pricerService.subTotal).toEqual(expectedSubTotal);
    expect(pricerService.discount).toEqual(expectedDiscount);
    expect(pricerService.total).toEqual(expectedTotal); 
  });

  it('applies buy one get one free offer and percentage offer', () => {
    const offers = [
      {
        productName: 'Baked Beans',
        rule: { buyQuantity: 2, freeQuantity: 1 }
      },
      { 
        productName: 'Sardines',
        rule: { percentage: 25 }
      }
    ];

    const basket = [
      {
        name: 'Baked Beans',
        quantity: 2,
      },
      {
        name: 'Biscuits',
        quantity: 1,
      },
      {
        name: 'Sardines',
        quantity: 2,
      },
    ];

    const pricerService = new BasketPricerService({ catalogue, basket, offers });
    const expectedSubTotal = '£6.96';
    const expectedDiscount = '£1.94';
    const expectedTotal = '£5.03';
    
    expect(pricerService.subTotal).toEqual(expectedSubTotal);
    expect(pricerService.discount).toEqual(expectedDiscount);
    expect(pricerService.total).toEqual(expectedTotal); 
  });

  it('applies buy one get cheapest one free for product set', () => {
    const offers = [
      {
        productName: 'Shampoo',
        rule: { buyQuantity: 3, freeQuantity: 1, freeVariant: 'Shampoo (Small)' }
      },
    ];

    const basket = [
      {
        name: 'Shampoo (Large)',
        quantity: 3,
      },
      {
        name: 'Shampoo (Medium)',
        quantity: 1,
      },
      {
        name: 'Shampoo (Small)',
        quantity: 2,
      },
    ];

    const pricerService = new BasketPricerService({ catalogue, basket, offers });
    const expectedSubTotal = '£17.00';
    const expectedDiscount = '£2.00';
    const expectedTotal = '£15.00';
    
    expect(pricerService.subTotal).toEqual(expectedSubTotal);
    expect(pricerService.discount).toEqual(expectedDiscount);
    expect(pricerService.total).toEqual(expectedTotal); 
  });
});