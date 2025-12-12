"use client";
import { ProductSchema } from "../../lib/validators/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import VariantBuilder from "./VariantBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ProductForm({
  defaultValues,
  onSubmit,
  categories,
}: any) {
  const methods = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const onError = (errors: any) => {
    console.log("Form Validation Errors:", errors);
  };

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit, onError)}
      >
        <div>
          <label>Nama Produk</label>
          <Input {...methods.register("name")} />
        </div>

        <div>
          <label>Harga</label>
          <Input type="number" {...methods.register("price")} />
          {methods.formState.errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {methods.formState.errors.price.message as string}
            </p>
          )}
        </div>

        <div>
          <label>Kategori</label>
          <Select
            onValueChange={(v) => methods.setValue("category_id", Number(v))}
          >
            <SelectTrigger>
              {methods.watch("category_id") || "Pilih kategori"}
            </SelectTrigger>
            <SelectContent>
              {categories.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label>Image URL</label>
          <Input {...methods.register("image_url")} />
        </div>

        <VariantBuilder />

        <Button type="submit" className="w-full">
          Simpan
        </Button>
      </form>
    </FormProvider>
  );
}
