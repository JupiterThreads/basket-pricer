import BasketPricerService from '../BasketPricerService.ts';
import * as fs from 'fs';
import path from 'path';


function testBasketPricer() {
  const catalogueFilePath = path.join('src/scripts/data', 'catalogue.json');
  const catalogue = JSON.parse(fs.readFileSync(catalogueFilePath, 'utf-8'));

  const offersFilePath = path.join('src/scripts/data', 'offers.json');
  const offers = JSON.parse(fs.readFileSync(offersFilePath, 'utf-8'));

  const basket1Path = path.join('src/scripts/data', 'basket-1.json');
  const basket = JSON.parse(fs.readFileSync(basket1Path, 'utf-8'));
  
  const pricer = new BasketPricerService({ catalogue, basket, offers });

  console.table({
    subTotal: pricer.subTotal,
    discount: pricer.discount,
    total: pricer.total
  });
}

testBasketPricer();
