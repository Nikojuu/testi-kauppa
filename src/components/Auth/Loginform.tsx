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
import { loginCustomer } from "@/lib/actions/authActions";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email("Virheellinen sähköpostiosoite"),
  password: z.string().min(1, "Salasana on pakollinen"),
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    try {
      const result = await loginCustomer(formData);
      if (result.error) {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : "Kirjautuminen epäonnistui. Tarkista sähköpostisi ja salasanasi";

        setFormError(errorMessage);

        toast({
          title: "Kirjautuminen epäonnistui",
          description: errorMessage,
          className:
            "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
          action: (
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
          ),
        });
      } else if (result.success) {
        setFormSuccess("Kirjautuminen onnistui! Tervetuloa takaisin!");

        toast({
          title: "Kirjautuminen onnistui",
          description: "Tervetuloa takaisin!",
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
      <Subtitle subtitle="Kirjaudu sisään" />
      <div className="max-w-md mx-auto container p-4 mt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Status Messages */}
            {formError && (
              <div className="flex items-center space-x-2 p-3 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {formError}
                </p>
              </div>
            )}

            {formSuccess && (
              <div className="flex items-center space-x-2 p-3 rounded-md bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  {formSuccess}
                </p>
              </div>
            )}

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
                      />
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
            />
            <Button
              className="w-1/2"
              variant="gooeyLeft"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
