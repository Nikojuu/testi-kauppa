import React from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CustomerData, customerDataSchema } from "@/lib/zodSchemas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CustomerDataFormProps {
  handleSubmit: (data: CustomerData) => void;
  initialData?: CustomerData | null;
}

export default function CustomerDataForm({
  handleSubmit,
  initialData,
}: CustomerDataFormProps) {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: customerDataSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const result = customerDataSchema.safeParse(Object.fromEntries(formData));
      if (result.success) {
        handleSubmit(result.data);
      }
    },
    defaultValue: initialData || undefined,
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit}>
      <Card className="mt-48 mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Tilaajan tiedot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
            <div className="flex gap-3">
              <div className="flex flex-col gap-3 w-1/2">
                <Label htmlFor={fields.first_name.id}>Etunimi</Label>
                <Input
                  id={fields.first_name.id}
                  name={fields.first_name.name}
                  defaultValue={initialData?.first_name || ""}
                  type="text"
                  placeholder="Anna etunimesi"
                />
                {fields.first_name.errors && (
                  <p className="text-red-500">{fields.first_name.errors}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 w-1/2">
                <Label htmlFor={fields.last_name.id}>Sukunimi</Label>
                <Input
                  id={fields.last_name.id}
                  name={fields.last_name.name}
                  defaultValue={initialData?.last_name || ""}
                  type="text"
                  placeholder="Anna sukunimesi"
                />
                {fields.last_name.errors && (
                  <p className="text-red-500">{fields.last_name.errors}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.email.id}>Sähköposti</Label>
              <Input
                id={fields.email.id}
                name={fields.email.name}
                defaultValue={initialData?.email || ""}
                type="email"
                placeholder="Anna sähköpostiosoitteesi"
              />
              {fields.email.errors && (
                <p className="text-red-500">{fields.email.errors}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.address.id}>Katuosoite</Label>
              <Input
                id={fields.address.id}
                name={fields.address.name}
                defaultValue={initialData?.address || ""}
                type="text"
                placeholder="Anna katuosoitteesi"
              />
              {fields.address.errors && (
                <p className="text-red-500">{fields.address.errors}</p>
              )}
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-3 w-1/2">
                <Label htmlFor={fields.postal_code.id}>Postinumero</Label>
                <Input
                  id={fields.postal_code.id}
                  name={fields.postal_code.name}
                  defaultValue={initialData?.postal_code || ""}
                  type="text"
                  placeholder="Anna postinumerosi"
                />
                {fields.postal_code.errors && (
                  <p className="text-red-500">{fields.postal_code.errors}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 w-1/2">
                <Label htmlFor={fields.city.id}>Kaupunki</Label>
                <Input
                  id={fields.city.id}
                  name={fields.city.name}
                  defaultValue={initialData?.city || ""}
                  type="text"
                  placeholder="Anna kaupungin nimi"
                />
                {fields.city.errors && (
                  <p className="text-red-500">{fields.city.errors}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor={fields.phone.id}>Puhelinnumero</Label>
              <Input
                id={fields.phone.id}
                name={fields.phone.name}
                defaultValue={initialData?.phone || ""}
                type="tel"
                placeholder="Anna puhelinnumerosi"
              />
              {fields.phone.errors && (
                <p className="text-red-500">{fields.phone.errors}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Jatka valitsemaan toimitustapa</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
