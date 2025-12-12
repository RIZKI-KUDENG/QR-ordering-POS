"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VariantBuilder() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">Variants</h3>
        <Button
          type="button"
          onClick={() =>
            append({
              name: "",
              is_required: false,
              options: [],
            })
          }
        >
          + Tambah Variant
        </Button>
      </div>

      {fields.map((variant, index) => (
        <div key={variant.id} className="p-4 border rounded space-y-3">
          <Input
            placeholder="Nama variant (contoh: Level, Ukuran, Topping)"
            {...register(`variants.${index}.name`)}
          />

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              {...register(`variants.${index}.is_required`)}
            />
            <span>Wajib dipilih</span>
          </label>

          <VariantOptions variantIndex={index} />

          <Button
            variant="destructive"
            type="button"
            onClick={() => remove(index)}
          >
            Hapus Variant
          </Button>
        </div>
      ))}
    </div>
  );
}

function VariantOptions({ variantIndex }: { variantIndex: number }) {
  const { control, register } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.options`,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium">Options</p>
        <Button
          type="button"
          onClick={() => append({ name: "", extra_price: 0 })}
        >
          + Tambah Option
        </Button>
      </div>

      {fields.map((opt, idx) => (
        <div key={opt.id} className="flex space-x-2 mb-2">
          <Input
            placeholder="Nama Option"
            {...register(`variants.${variantIndex}.options.${idx}.name`)}
          />
          <Input
            placeholder="Harga tambahan"
            type="number"
            {...register(`variants.${variantIndex}.options.${idx}.extra_price`)}
          />
          <Button
            variant="destructive"
            type="button"
            onClick={() => remove(idx)}
          >
            X
          </Button>
        </div>
      ))}
    </div>
  );
}
