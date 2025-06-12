"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Subtitle from "@/components/subtitle";
import { registerCustomer } from "@/lib/actions/authActions";
import { useRouter } from "next/navigation";

const RegisterSchema = z.object({
  firstName: z.string().min(1, "Etunimi on pakollinen"),
  lastName: z.string().min(1, "Sukunimi on pakollinen"),
  email: z.string().email("Virheellinen sähköpostiosoite"),
  password: z.string().min(8, "Salasanan on oltava vähintään 8 merkkiä pitkä"),
});

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    try {
      const result = await registerCustomer(formData);
      if (result.error) {
        toast({
          title: "Rekisteröinti epäonnistui",
          description:
            typeof result.error === "string"
              ? result.error
              : "Tarkista tietosi ja yritä uudelleen",
          className:
            "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
          action: (
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
          ),
        });
      } else if (result.success) {
        toast({
          title: "Rekisteröinti onnistui",
          description:
            "Tili luotu! Tarkista sähköpostisi vahvistaaksesi tilisi.",
          className:
            "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800",
          action: (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
          ),
        });
        form.reset();
        router.push("/mypage");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full mt-24 md:mt-48">
      <Subtitle subtitle="Luo tilisi" />
      <div className="max-w-md mx-auto container p-4 mt-10">
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
                  <FormLabel>Sukunimi *</FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salasana *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />{" "}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Piilota salasana" : "Näytä salasana"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <Button
              className="w-1/2"
              variant="gooeyLeft"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Luodaan tiliä..." : "Rekisteröidy"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
