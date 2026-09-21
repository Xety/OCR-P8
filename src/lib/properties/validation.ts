import { z } from "zod";

const propertySchema = z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    title: z.string().min(1),
    cover: z.string().nullable(),
    location: z.string().nullable(),
    price_per_night: z.number().nonnegative(),
});

export const propertyListSchema = z.array(propertySchema);

export const propertyDetailsSchema = propertySchema.extend({
    description: z.string().nullable(),
    rating_avg: z.number().nullable(),
    host: z.object({
        id: z.number().int().positive(),
        name: z.string().min(1),
        picture: z.string().nullable(),
    }),
    pictures: z.array(z.string().min(1)),
    equipments: z.array(z.string().min(1)),
    tags: z.array(z.string().min(1)),
});

export type PropertySummary = z.infer<typeof propertySchema>;
export type PropertyDetails = z.infer<typeof propertyDetailsSchema>;
