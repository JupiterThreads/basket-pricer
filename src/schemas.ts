import { z } from 'zod';

export const productVariantSchema = z.object({
    name: z.string(),
    price: z.number().positive(),
});

export const productSchema = z.object({
    name: z.string(),
    price: z.optional(z.number().positive()),
    variants: z.optional(z.array(productVariantSchema)),
});

export const catalogueSchema = z.array(productSchema);

export const buyOfferSchema = z.object({
    buyQuantity: z.number().nonnegative(),
    freeQuantity: z.number().nonnegative(),
    freeVariant: z.optional(z.string()),
});

export const percentageOfferSchema = z.object({
    percentage: z.number().positive(),
});

export const offerSchema = z.object({
    productName: z.string(),
    rule: z.union([percentageOfferSchema, buyOfferSchema]),
});

export const basketItemSchema = z.object({
    quantity: z.optional(z.number().positive()),
    name: z.optional(z.string()),
});

export const basketSchema = z.array(basketItemSchema);

export const currencySchema = z.object({
    currency: z.string(),
    locale: z.string(),
});

export const requestSchema = z.object({
    basket: basketSchema,
    catalogue: catalogueSchema,
    offers: z.optional(z.array(offerSchema)),
    currencySchema: z.optional(currencySchema),
});
