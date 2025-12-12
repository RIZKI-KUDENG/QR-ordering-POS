import prisma from "../db/database.js";

export const createProductService = async (data) => {

  const productData = {
    name: data.name,
    price: data.price, 
    image_url: data.image_url,
    category_id: data.category_id,
    is_available: data.is_available ?? true,
  };

//apakah user mengirim variants?
  if (data.variants && data.variants.create && data.variants.create.length > 0) {
    productData.variants = {
      create: data.variants.create.map((variant) => ({
        name: variant.name,
        is_required: variant.is_required,
        options: {
          create: variant.options.create.map((option) => ({
            name: option.name,
            extra_price: option.extra_price,
          })),
        },
      })),
    };
  }

  // Eksekusi ke Database
  const newProduct = await prisma.product.create({
    data: productData, 
    include: {         
      variants: {
        include: {
          options: true,
        },
      },
    },
  });

  return newProduct;
};