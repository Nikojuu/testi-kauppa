// CustomerDataForm.tsx
import React from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CustomerData, customerDataSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Button } from "@/components/ui/button";

interface CustomerDataFormProps {
  handleSubmit: (data: CustomerData) => void;
}

const CustomerDataForm: React.FC<CustomerDataFormProps> = ({
  handleSubmit,
}) => {
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
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit}>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Tilaajan tiedot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6">
            <div className="flex gap-3">
              <div className="flex flex-col gap-3 w-1/2">
                <Label>Etunimi</Label>
                <Input
                  name={fields.first_name.name}
                  key={fields.first_name.key}
                  type="text"
                  placeholder="Anna etunimesi"
                />
                <p className="text-red-500">{fields.first_name.errors}</p>
              </div>
              <div className="flex flex-col gap-3 w-1/2">
                <Label>Sukunimi</Label>
                <Input
                  name={fields.last_name.name}
                  key={fields.last_name.key}
                  type="text"
                  placeholder="Anna sukunimesi"
                />
                <p className="text-red-500">{fields.last_name.errors}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Sähköposti</Label>
              <Input
                name={fields.email.name}
                key={fields.email.key}
                type="text"
                placeholder="Anna sähköpostiosoitteesi"
              />
              <p className="text-red-500">{fields.email.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Katuosoite</Label>
              <Input
                name={fields.address.name}
                key={fields.address.key}
                type="text"
                placeholder="Anna katuosoitteesi"
              />
              <p className="text-red-500">{fields.address.errors}</p>
            </div>

            <div className="flex gap-3 ">
              <div className="flex flex-col gap-3 w-1/2">
                <Label>Postinumero</Label>
                <Input
                  name={fields.postal_code.name}
                  key={fields.postal_code.key}
                  type="text"
                  placeholder="Anna postinumerosi"
                />
                <p className="text-red-500">{fields.postal_code.errors}</p>
              </div>{" "}
              <div className="flex flex-col gap-3 w-1/2">
                <Label>Kaupunki</Label>
                <Input
                  name={fields.city.name}
                  key={fields.city.key}
                  type="text"
                  placeholder="Anna kaupungin nimi"
                />
                <p className="text-red-500">{fields.city.errors}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Puhelinnumero</Label>
              <Input
                name={fields.phone.name}
                key={fields.phone.key}
                type="text"
                placeholder="Anna puhelinnumerosi"
              />
              <p className="text-red-500">{fields.phone.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Jatka valitsemaan toimitustapa</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CustomerDataForm;
