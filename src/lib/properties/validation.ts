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

export type PropertySummary = z.infer<typeof propertySchema>;
