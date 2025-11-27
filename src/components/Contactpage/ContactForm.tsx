"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/app/actions";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Subtitle from "@/components/subtitle";

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters long"),
});

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    const result = await submitContactForm(formData);
    if (result.error) {
      toast({
        title: "Lomakkeen lähetys epäonnistui",
        description: "Tarkista antamasi tiedot ja yritä uudelleen",
        className:
          "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
        action: (
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
        ),
      });
      setFormStatus("Form submission failed. Please try again.");
    } else if (result.success) {
      toast({
        title: "Lomake lähetetty onnistuneesti",
        description: "Kiitos yhteydenotostasi. Palaamme asiaan pian.",
        className:
          "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800",
        action: (
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
          </div>
        ),
      });
      setFormStatus(result.success);
      form.reset();
    }
  }

  return (
    <section className="pt-8 md:pt-16 pb-16 bg-warm-white">
      <Subtitle
        subtitle="Ollaan yhteydessä!"
        description="Kerro minulle ideasi tai kysy mitä vain - vastaan mielelläni"
      />

      <div className="container mx-auto px-4 max-w-xl">
        {/* Form card */}
        <div className="relative bg-warm-white p-6 md:p-10">
          {/* Card border */}
          <div className="absolute inset-0 border border-rose-gold/15 pointer-events-none" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/40" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/40" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/40" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/40" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name fields in a row on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-secondary text-sm">
                        Etunimi *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                        />
                      </FormControl>
                      <FormMessage className="text-deep-burgundy text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal font-secondary text-sm">
                        Sukunimi
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                        />
                      </FormControl>
                      <FormMessage className="text-deep-burgundy text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-charcoal font-secondary text-sm">
                      Sähköposti *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                      />
                    </FormControl>
                    <FormMessage className="text-deep-burgundy text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-charcoal font-secondary text-sm">
                      Viesti *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Laita minulle viestiä jos sinulla on idea jonka haluat toteuttaa tai vain rupatella jostain..."
                        {...field}
                        rows={5}
                        className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40 resize-none"
                      />
                    </FormControl>
                    <FormDescription className="text-charcoal/50 text-xs font-secondary">
                      Viestissä tulee olla vähintään 5 kirjainta
                    </FormDescription>
                    <FormMessage className="text-deep-burgundy text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-3 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold"
                >
                  Lähetä viesti
                </Button>
              </div>
            </form>
          </Form>

          {formStatus && (
            <div className="mt-6 p-4 bg-soft-blush/30 border border-rose-gold/20 text-center">
              <p className="text-sm font-secondary text-charcoal/80">
                {formStatus}
              </p>
            </div>
          )}
        </div>

        {/* Alternative contact info */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/40" />
            <span className="text-xs tracking-[0.2em] uppercase font-secondary text-charcoal/50">
              tai
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/40" />
          </div>

          <p className="text-sm font-secondary text-charcoal/60 mb-3">
            Voit myös lähettää sähköpostia suoraan
          </p>
          <a
            href="mailto:pupunkorvat.kauppa@gmail.com"
            className="inline-flex items-center gap-2 text-charcoal hover:text-rose-gold transition-colors duration-300 font-secondary"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>pupunkorvat.kauppa@gmail.com</span>
          </a>
        </div>
      </div>
    </section>
  );
}
