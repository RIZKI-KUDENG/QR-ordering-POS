/*
  Warnings:

  - A unique constraint covering the columns `[name,product_id]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Variant_name_product_id_key" ON "Variant"("name", "product_id");
