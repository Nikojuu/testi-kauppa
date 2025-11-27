"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  editCustomerProfile,
  deleteCustomerAccount,
} from "@/lib/actions/authActions";
import {
  User,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
  };
};

const EditCustomerForm = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formState, setFormState] = useState<FormState>({});
  const router = useRouter();
  const { toast } = useToast();
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await editCustomerProfile(formData);

      if (result.error) {
        // Log API error for debugging
        console.error("Profile update API error:", result.error);

        if (typeof result.error === "string") {
          toast({
            title: "Profiilin päivittäminen epäonnistui",
            description: result.error,
            className:
              "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
            action: (
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
            ),
          });
          setFormState({
            error: result.error,
          });
        } else {
          // Handle Zod field errors - they come with Finnish messages from the schema
          toast({
            title: "Profiilin päivittäminen epäonnistui",
            description: "Tarkista antamasi tiedot ja yritä uudelleen",
            className:
              "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
            action: (
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              </div>
            ),
          });
          setFormState({ fieldErrors: result.error });
        }
      } else {
        toast({
          title: "Profiili päivitetty onnistuneesti",
          description: "Tietosi on päivitetty onnistuneesti.",
          className:
            "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800",
          action: (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
          ),
        });
        setFormState({
          success: "Profiili päivitetty onnistuneesti!",
        });
        // Refresh the page to show updated data
        router.refresh();
      }
    });
  };
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCustomerAccount();

      if (result.error) {
        // Log API error for debugging
        console.error("Account deletion API error:", result.error);
        toast({
          title: "Tilin poistaminen epäonnistui",
          description: "Yritä uudelleen.",
          className:
            "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
          action: (
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
          ),
        });
        setFormState({
          error: "Tilin poistaminen epäonnistui. Yritä uudelleen.",
        });
      } else {
        toast({
          title: "Tili poistettu",
          description: "Tili on poistettu onnistuneesti.",
          className:
            "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800",
          action: (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
          ),
        });
        // Redirect to home page after successful deletion
        router.push("/");
      }
    } catch (error) {
      console.error("Unexpected error during account deletion:", error);
      toast({
        title: "Odottamaton virhe tapahtui",
        description: "Yritä uudelleen.",
        className:
          "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
        action: (
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
        ),
      });
      setFormState({
        error: "Odottamaton virhe tapahtui. Yritä uudelleen.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
          <h2 className="text-2xl md:text-3xl font-primary text-charcoal">Omat tiedot</h2>
        </div>
        <p className="font-secondary text-charcoal/60 ml-5">
          Hallitse tilitietojasi ja asetuksiasi
        </p>
      </div>

      {/* Profile Edit Form */}
      <div className="relative bg-warm-white p-6 md:p-8">
        {/* Border frame */}
        <div className="absolute inset-0 border border-rose-gold/15 pointer-events-none" />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/40" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/40" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/40" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-rose-gold" />
            <h3 className="font-primary text-xl text-charcoal">Profiilitiedot</h3>
          </div>
          <p className="font-secondary text-sm text-charcoal/60 mb-6">
            Muokkaa henkilötietojasi ja yhteystietojasi
          </p>

          <div className="mb-6 h-[1px] bg-gradient-to-r from-rose-gold/30 to-transparent" />

          {formState.error && (
            <div className="mb-6 flex items-center space-x-3 p-4 bg-deep-burgundy/10 border border-deep-burgundy/30">
              <AlertTriangle className="h-5 w-5 text-deep-burgundy flex-shrink-0" />
              <p className="text-sm font-secondary text-charcoal/80">{formState.error}</p>
            </div>
          )}
          {formState.success && (
            <div className="mb-6 flex items-center space-x-3 p-4 bg-rose-gold/10 border border-rose-gold/30">
              <CheckCircle className="h-5 w-5 text-rose-gold flex-shrink-0" />
              <p className="text-sm font-secondary text-charcoal/80">{formState.success}</p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-secondary text-charcoal">
                  Etunimi
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={user.firstName}
                  disabled={isPending}
                  className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal"
                />
                {formState.fieldErrors?.firstName && (
                  <p className="text-sm font-secondary text-deep-burgundy">
                    {formState.fieldErrors.firstName[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-secondary text-charcoal">
                  Sukunimi
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={user.lastName}
                  disabled={isPending}
                  className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal"
                />
                {formState.fieldErrors?.lastName && (
                  <p className="text-sm font-secondary text-deep-burgundy">
                    {formState.fieldErrors.lastName[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-secondary text-charcoal">
                Sähköpostiosoite
              </label>
              <Input
                id="email"
                name="email"
                type="text"
                defaultValue={user.email}
                disabled={isPending}
                className="bg-cream/50 border-rose-gold/20 focus:border-rose-gold/50 focus:ring-rose-gold/20 font-secondary text-charcoal"
              />
              {formState.fieldErrors?.email && (
                <p className="text-sm font-secondary text-deep-burgundy">
                  {formState.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-3 px-8 py-3 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] justify-center"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tallennetaan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Tallenna
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Deletion Section */}
      <div className="relative bg-warm-white p-6 md:p-8">
        {/* Border frame with danger color */}
        <div className="absolute inset-0 border border-deep-burgundy/20 pointer-events-none" />

        {/* Corner accents with danger color */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-deep-burgundy/50" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-deep-burgundy/50" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-deep-burgundy/50" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-deep-burgundy/50" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-5 h-5 text-deep-burgundy" />
            <h3 className="font-primary text-xl text-deep-burgundy">Vaarallinen alue</h3>
          </div>
          <p className="font-secondary text-sm text-charcoal/60 mb-6">
            Poista tilisi pysyvästi. Tätä toimintoa ei voi peruuttaa.
          </p>

          <div className="mb-6 h-[1px] bg-gradient-to-r from-deep-burgundy/30 to-transparent" />

          <div className="space-y-4">
            <div className="p-4 bg-deep-burgundy/5 border border-deep-burgundy/20">
              <h4 className="font-primary text-base text-deep-burgundy mb-3">
                Mitä tapahtuu, kun poistat tilisi:
              </h4>
              <ul className="text-sm font-secondary text-charcoal/70 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-deep-burgundy mt-1">•</span>
                  <span>Kaikki henkilötietosi poistetaan pysyvästi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-deep-burgundy mt-1">•</span>
                  <span>Tilaushistoriasi säilyy nimettömänä</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-deep-burgundy mt-1">•</span>
                  <span>Et voi enää kirjautua sisään</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-deep-burgundy mt-1">•</span>
                  <span>Tätä toimintoa ei voi peruuttaa</span>
                </li>
              </ul>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-3 bg-deep-burgundy text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-deep-burgundy/80"
              >
                <Trash2 className="w-4 h-4" />
                Poista tili
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-deep-burgundy/10 border border-deep-burgundy/30">
                  <AlertTriangle className="h-5 w-5 text-deep-burgundy flex-shrink-0" />
                  <p className="text-sm font-secondary text-charcoal/80">
                    Oletko varma, että haluat poistaa tilisi pysyvästi?
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold disabled:opacity-50"
                  >
                    Peruuta
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-3 bg-deep-burgundy text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-deep-burgundy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Poistetaan...
                      </>
                    ) : (
                      "Kyllä, poista tili"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerForm;
