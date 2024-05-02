import { z } from 'zod'; 
import { 
    catalogueSchema, 
    productSchema, 
    offerSchema,
    basketSchema, 
    buyOfferSchema,
    percentageOfferSchema,
    productVariantSchema,
    basketItemSchema,
    currencySchema
} from './schemas';

export type Catalogue = z.infer<typeof catalogueSchema>;

export type Product = z.infer<typeof productSchema>;

export type Offer = z.infer<typeof offerSchema>;

export type Basket = z.infer<typeof basketSchema>;

export type BuyOffer = z.infer<typeof buyOfferSchema>;

export type PercentageOffer = z.infer<typeof percentageOfferSchema>;

export type BasketItem = z.infer<typeof basketItemSchema>;

export type ProductVariant = z.infer<typeof productVariantSchema>;

export type CurrencyOptions = z.infer<typeof currencySchema>;
