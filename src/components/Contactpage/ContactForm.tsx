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
import { Metadata } from "next";

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
    <div className="w-full mt-48">
      <Subtitle subtitle="Ollaan yhteydessä!" />
      <div className="max-w-md mx-auto mt-10 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etunimi *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sukunimi</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sähköposti *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Viesti *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Laita minulle viestiä jos sinulla on idea jonka haluat toteuttaa tai vain rupatella jostain..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Viestissä tulee olla vähintään 5 kirjainta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-1/2" variant="gooeyLeft" type="submit">
              Lähetä
            </Button>
          </form>
        </Form>
        {formStatus && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">
            {formStatus}
          </p>
        )}
      </div>
    </div>
  );
}
