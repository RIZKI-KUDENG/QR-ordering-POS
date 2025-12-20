import z from "zod";

export const VariantOptionSchema = z.object({
  name: z.string().min(1, "Variant option name is required"),
  extra_price: z.coerce.number().min(0, "Variant option price is required"),
});

export const VariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  is_required: z.boolean().default(false),
  options: z.array(VariantOptionSchema),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(1, "Product price is required"),
  stock: z.coerce.number().min(0, "Product stock is required"),
  image_url: z.string().min(1, "Product image is required"),
  category_id: z.coerce.number().min(1, "Product category is required"),
  variants: z.array(VariantSchema).optional(),
});
