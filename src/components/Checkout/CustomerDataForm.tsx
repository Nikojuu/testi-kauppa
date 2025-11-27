"use client";
import React from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CustomerData, customerDataSchema } from "@/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "../ui/phone-input";
import { Loader2 } from "lucide-react";

interface CustomerDataFormProps {
  handleSubmit: (data: CustomerData) => void;
  initialData?: CustomerData | null;
  isLoading: boolean;
}

export default function CustomerDataForm({
  handleSubmit,
  initialData,
  isLoading,
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
      <div className="mx-auto max-w-2xl">
        {/* Form card */}
        <div className="relative bg-warm-white p-6 md:p-10">
          {/* Border frame */}
          <div className="absolute inset-0 border border-rose-gold/15 pointer-events-none" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/40" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/40" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/40" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/40" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
            <h2 className="font-primary text-2xl md:text-3xl text-charcoal">
              Tilaajan tiedot
            </h2>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={fields.first_name.id}
                  className="text-sm font-secondary text-charcoal"
                >
                  Etunimi *
                </Label>
                <Input
                  id={fields.first_name.id}
                  name={fields.first_name.name}
                  defaultValue={initialData?.first_name || ""}
                  type="text"
                  placeholder="Anna etunimesi"
                  className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                />
                {fields.first_name.errors && (
                  <p className="text-sm font-secondary text-deep-burgundy">
                    {fields.first_name.errors}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={fields.last_name.id}
                  className="text-sm font-secondary text-charcoal"
                >
                  Sukunimi *
                </Label>
                <Input
                  id={fields.last_name.id}
                  name={fields.last_name.name}
                  defaultValue={initialData?.last_name || ""}
                  type="text"
                  placeholder="Anna sukunimesi"
                  className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                />
                {fields.last_name.errors && (
                  <p className="text-sm font-secondary text-deep-burgundy">
                    {fields.last_name.errors}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor={fields.email.id}
                className="text-sm font-secondary text-charcoal"
              >
                Sähköposti *
              </Label>
              <Input
                id={fields.email.id}
                name={fields.email.name}
                defaultValue={initialData?.email || ""}
                type="email"
                placeholder="Anna sähköpostiosoitteesi"
                className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
              />
              {fields.email.errors && (
                <p className="text-sm font-secondary text-deep-burgundy">
                  {fields.email.errors}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor={fields.address.id}
                className="text-sm font-secondary text-charcoal"
              >
                Katuosoite *
              </Label>
              <Input
                id={fields.address.id}
                name={fields.address.name}
                defaultValue={initialData?.address || ""}
                type="text"
                placeholder="Anna katuosoitteesi"
                className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
              />
              {fields.address.errors && (
                <p className="text-sm font-secondary text-deep-burgundy">
                  {fields.address.errors}
                </p>
              )}
            </div>

            {/* Postal code and City row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={fields.postal_code.id}
                  className="text-sm font-secondary text-charcoal"
                >
                  Postinumero *
                </Label>
                <Input
                  id={fields.postal_code.id}
                  name={fields.postal_code.name}
                  defaultValue={initialData?.postal_code || ""}
                  type="text"
                  placeholder="Anna postinumerosi"
                  className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                />
                {fields.postal_code.errors && (
                  <p className="text-sm font-secondary text-deep-burgundy">
                    {fields.postal_code.errors}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={fields.city.id}
                  className="text-sm font-secondary text-charcoal"
                >
                  Kaupunki *
                </Label>
                <Input
                  id={fields.city.id}
                  name={fields.city.name}
                  defaultValue={initialData?.city || ""}
                  type="text"
                  placeholder="Anna kaupungin nimi"
                  className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                />
                {fields.city.errors && (
                  <p className="text-sm font-secondary text-deep-burgundy">
                    {fields.city.errors}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm font-secondary text-charcoal">
                Puhelinnumero *
              </Label>
              <PhoneInput
                id={fields.phone.id}
                name={fields.phone.name}
                defaultCountry="FI"
                international
                placeholder="Anna puhelin numerosi"
                className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
              />
              {fields.phone.errors && (
                <p className="text-sm font-secondary text-deep-burgundy">
                  {fields.phone.errors}
                </p>
              )}
            </div>
          </div>

          {/* Decorative line before button */}
          <div className="mt-8 mb-6 h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Ladataan...</span>
                </>
              ) : (
                <>
                  <span>Jatka maksamaan</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
