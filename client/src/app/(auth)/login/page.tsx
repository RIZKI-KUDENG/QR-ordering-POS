"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
FieldError
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(3, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
  }
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <form className="w-3/4 md:w-1/4 p-4 border border-gray-300" onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldLegend className="text-center">Silahkan Login</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <FieldDescription>
                Silahkan masukan username anda
              </FieldDescription>
              <Input id="username" type="text" placeholder="username" {...register("username")} />
              <FieldError>{errors.username?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldDescription>
                Silahkan masukan password anda
              </FieldDescription>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              <FieldError>{errors.password?.message}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Button className="w-full mt-4" type="submit">Login</Button>
      </form>
    </div>
  );
}
