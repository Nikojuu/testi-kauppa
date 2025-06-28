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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Omat tiedot</h2>
        <p className="text-muted-foreground">
          Hallitse tilitietojasi ja asetuksiasi
        </p>
      </div>

      {/* Profile Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profiilitiedot
          </CardTitle>
          <CardDescription>
            Muokkaa henkilötietojasi ja yhteystietojasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formState.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}
          {formState.success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {formState.success}
              </AlertDescription>
            </Alert>
          )}{" "}
          <form action={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  Etunimi
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={user.firstName}
                  disabled={isPending}
                />
                {formState.fieldErrors?.firstName && (
                  <p className="text-sm text-red-600">
                    {formState.fieldErrors.firstName[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Sukunimi
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={user.lastName}
                  disabled={isPending}
                />
                {formState.fieldErrors?.lastName && (
                  <p className="text-sm text-red-600">
                    {formState.fieldErrors.lastName[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Sähköpostiosoite
              </label>
              <Input
                id="email"
                name="email"
                type="text"
                defaultValue={user.email}
                disabled={isPending}
              />
              {formState.fieldErrors?.email && (
                <p className="text-sm text-red-600">
                  {formState.fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[120px]"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tallennetaan...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Tallenna
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Deletion Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Vaarallinen alue
          </CardTitle>
          <CardDescription>
            Poista tilisi pysyvästi. Tätä toimintoa ei voi peruuttaa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">
                Mitä tapahtuu, kun poistat tilisi:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Kaikki henkilötietosi poistetaan pysyvästi</li>
                <li>• Tilaushistoriasi säilyy nimettömänä</li>
                <li>• Et voi enää kirjautua sisään</li>
                <li>• Tätä toimintoa ei voi peruuttaa</li>
              </ul>
            </div>

            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Poista tili
              </Button>
            ) : (
              <div className="space-y-3">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Oletko varma, että haluat poistaa tilisi pysyvästi?
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    Peruuta
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Poistetaan...
                      </div>
                    ) : (
                      "Kyllä, poista tili"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCustomerForm;
