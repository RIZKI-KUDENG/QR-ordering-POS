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
 if(data.variants && Array.isArray(data.variants) && data.variants.length > 0){
  productData.variants = {
      create: data.variants.map((variant) => ({
        name: variant.name,
        is_required: variant.is_required,
        options: {
          create: variant.options && variant.options.length > 0 
            ? variant.options.map((option) => ({
                name: option.name,
                extra_price: option.extra_price,
              })) 
            : [],
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

export const updateProductService = async (id, data) => {
  const { variants, ...productData } = data; 

  delete productData.id;
  delete productData.category; 

  return await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: Number(id) }, 
      data: productData,
    });

    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (variant.id) {
          await tx.variant.update({
            where: { id: variant.id },
            data: {
              name: variant.name,
              is_required: variant.is_required,
            },
          });

          if (variant.options && Array.isArray(variant.options)) {
            for (const option of variant.options) {
              if (option.id) {
                await tx.variantOption.update({
                  where: { id: option.id },
                  data: {
                    name: option.name,
                    extra_price: option.extra_price,
                  },
                });
              } else {
                await tx.variantOption.create({
                  data: {
                    variant_id: variant.id,
                    name: option.name,
                    extra_price: option.extra_price,
                  },
                });
              }
            }
          }
        } else {
          await tx.variant.create({
            data: {
              product_id: updatedProduct.id,
              name: variant.name,
              is_required: variant.is_required,
              options: {
                create: variant.options?.map((opt) => ({
                  name: opt.name,
                  extra_price: opt.extra_price,
                })),
              },
            },
          });
        }
      }
    }

    return updatedProduct;
  });
};