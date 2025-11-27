// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import Subtitle from "@/components/subtitle";
// import { loginCustomer } from "@/lib/actions/authActions";
// import { useRouter } from "next/navigation";

// const LoginSchema = z.object({
//   email: z.string().email("Virheellinen sähköpostiosoite"),
//   password: z.string().min(1, "Salasana on pakollinen"),
// });

// export default function LoginForm() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);
//   const [formSuccess, setFormSuccess] = useState<string | null>(null);

//   const form = useForm<z.infer<typeof LoginSchema>>({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   async function onSubmit(data: z.infer<typeof LoginSchema>) {
//     setIsLoading(true);
//     setFormError(null);
//     setFormSuccess(null);

//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => formData.append(key, value));

//     try {
//       const result = await loginCustomer(formData);
//       if (result.error) {
//         if (result.error) {
//           console.error("Login API Error:", result.error);
//           setFormError(
//             "Kirjautuminen epäonnistui. Tarkista sähköpostisi ja salasanasi."
//           );
//         }

//         toast({
//           title: "Kirjautuminen epäonnistui",
//           description:
//             "Kirjautuminen epäonnistui. Tarkista sähköpostisi ja salasanasi.",
//           className:
//             "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
//           action: (
//             <div className="flex items-center space-x-2">
//               <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
//             </div>
//           ),
//         });
//       } else if (result.success) {
//         setFormSuccess("Kirjautuminen onnistui! Tervetuloa takaisin!");

//         toast({
//           title: "Kirjautuminen onnistui",
//           description: "Tervetuloa takaisin!",
//           className:
//             "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800",
//           action: (
//             <div className="flex items-center space-x-2">
//               <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
//             </div>
//           ),
//         });

//         form.reset();
//         router.push("/mypage");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="w-full mt-24 md:mt-48">
//       <Subtitle subtitle="Kirjaudu sisään" />
//       <div className="max-w-md mx-auto container p-4 mt-10">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Form Status Messages */}
//             {formError && (
//               <div className="flex items-center space-x-2 p-3 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
//                 <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
//                 <p className="text-sm text-red-700 dark:text-red-300">
//                   {formError}
//                 </p>
//               </div>
//             )}

//             {formSuccess && (
//               <div className="flex items-center space-x-2 p-3 rounded-md bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
//                 <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
//                 <p className="text-sm text-green-700 dark:text-green-300">
//                   {formSuccess}
//                 </p>
//               </div>
//             )}

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Sähköposti *</FormLabel>
//                   <FormControl>
//                     <Input type="email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Salasana *</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input
//                         type={showPassword ? "text" : "password"}
//                         {...field}
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                         onClick={() => setShowPassword(!showPassword)}
//                         aria-label={
//                           showPassword ? "Piilota salasana" : "Näytä salasana"
//                         }
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-4 w-4" aria-hidden="true" />
//                         ) : (
//                           <Eye className="h-4 w-4" aria-hidden="true" />
//                         )}
//                       </Button>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button
//               className="w-1/2"
//               variant="gooeyLeft"
//               type="submit"
//               disabled={isLoading}
//             >
//               {isLoading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

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
import { CheckCircle, XCircle, Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Subtitle from "@/components/subtitle";
import {
  loginCustomer,
  resendVerificationEmail,
} from "@/lib/actions/authActions";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email("Virheellinen sähköpostiosoite"),
  password: z.string().min(1, "Salasana on pakollinen"),
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

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
    setRequiresVerification(false);
    setCustomerId(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    try {
      const result = await loginCustomer(formData);

      if (result.requiresVerification && result.customerId) {
        setRequiresVerification(true);
        setCustomerId(result.customerId);
        setFormError(
          result.error || "Vahvista sähköpostiosoitteesi ennen kirjautumista."
        );
      } else if (result.error) {
        setFormError(
          "Kirjautuminen epäonnistui. Tarkista sähköpostisi ja salasanasi."
        );
        toast({
          title: "Kirjautuminen epäonnistui",
          description:
            "Kirjautuminen epäonnistui. Tarkista sähköpostisi ja salasanasi.",
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
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!customerId) return;

    setIsResendingVerification(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const result = await resendVerificationEmail(customerId);

      if (result.success) {
        setFormSuccess("Vahvistussähköposti lähetetty! Tarkista sähköpostisi.");
        toast({
          title: "Sähköposti lähetetty",
          description:
            "Vahvistussähköposti on lähetetty. Tarkista sähköpostisi.",
          className:
            "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800",
          action: (
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
          ),
        });
      } else {
        setFormError(result.error || "Sähköpostin lähettäminen epäonnistui.");
        toast({
          title: "Virhe",
          description: "Sähköpostin lähettäminen epäonnistui. Yritä uudelleen.",
          variant: "destructive",
        });
      }
    } finally {
      setIsResendingVerification(false);
    }
  }

  return (
    <div className="w-full pt-8 md:pt-16 pb-16 md:pb-24 bg-warm-white min-h-screen">
      <div className="container mx-auto px-4">
        <Subtitle subtitle="Kirjaudu sisään" />

        <div className="max-w-lg mx-auto mt-12">
          {/* Form card */}
          <div className="relative bg-warm-white p-8 md:p-10">
            {/* Border frame */}
            <div className="absolute inset-0 border border-rose-gold/15 pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-rose-gold/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-rose-gold/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-rose-gold/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-rose-gold/40" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
              <h2 className="font-primary text-2xl md:text-3xl text-charcoal">
                Tervetuloa takaisin
              </h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Form Status Messages */}
                {formError && (
                  <div className="flex items-center space-x-3 p-4 bg-deep-burgundy/10 border border-deep-burgundy/30">
                    <XCircle className="h-5 w-5 text-deep-burgundy flex-shrink-0" />
                    <p className="text-sm font-secondary text-charcoal/80">
                      {formError}
                    </p>
                  </div>
                )}

                {formSuccess && (
                  <div className="flex items-center space-x-3 p-4 bg-rose-gold/10 border border-rose-gold/30">
                    <CheckCircle className="h-5 w-5 text-rose-gold flex-shrink-0" />
                    <p className="text-sm font-secondary text-charcoal/80">
                      {formSuccess}
                    </p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-secondary text-charcoal">
                        Sähköposti *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                          placeholder="anna@esimerkki.fi"
                        />
                      </FormControl>
                      <FormMessage className="text-sm font-secondary text-deep-burgundy" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-secondary text-charcoal">
                        Salasana *
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal placeholder:text-charcoal/40"
                            placeholder="Salasanasi"
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-charcoal/60 hover:text-rose-gold transition-colors"
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
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-secondary text-deep-burgundy" />
                    </FormItem>
                  )}
                />

                {/* Decorative line before buttons */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
                  </button>

                  {requiresVerification && customerId && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResendingVerification ? (
                        "Lähetetään..."
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          Lähetä uudelleen
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
