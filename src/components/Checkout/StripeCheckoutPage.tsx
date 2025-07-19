"use client";

import React, { useState } from "react";

import CustomerDataForm from "@/components/Checkout/CustomerDataForm";
import { useCart } from "@/hooks/use-cart";
import { CustomerData, customerDataSchema } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { SelectShipmentMethod } from "@/components/Checkout/SelectShipmentMethod";
import {
  DropInLocation,
  ShipitAgentLocation,
  ShipitShippingMethod,
  ShipmentMethods,
  ShipmentMethodsWithLocations,
} from "@/app/utils/types";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { CheckoutSteps } from "@/components/Checkout/CheckoutSteps";

import { unstable_noStore } from "next/cache";
import {
  getDropInLocations,
  getShipmentMethods,
} from "@/lib/actions/shipmentActions";
import { PAYMENT_METHODS } from "@/app/utils/constants";
import { notFound, useRouter } from "next/navigation";
import { CheckoutButton } from "../Cart/CheckoutButton";
import { createStripeCheckoutSession } from "@/lib/actions/stripeActions";
import { isSaleActive } from "@/lib/utils";

export type ChosenShipmentType = {
  shipmentMethodId: string;
  pickupId: string | null;
};

const StripeCheckoutPage = () => {
  unstable_noStore();
  const items = useCart((state) => state.items);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [shipmentMethodsAndLocations, setShipmentMethodsAndLocations] =
    useState<ShipmentMethodsWithLocations | null>(null);
  const [step, setStep] = useState(1);
  const [chosenShipmentMethod, setChosenShipmentMethod] =
    useState<ChosenShipmentType | null>(null);

  const router = useRouter();
  const cartTotal = items.reduce(
    (total, { product, variation, cartQuantity }) => {
      let effectivePrice: number;

      if (variation) {
        // Handle variation-specific pricing logic
        const isVariationOnSale =
          isSaleActive(variation.saleStartDate, variation.saleEndDate) &&
          variation.salePrice !== null;
        effectivePrice = isVariationOnSale
          ? variation.salePrice!
          : variation.price!;
      } else {
        // Handle product-level pricing logic
        const isProductOnSale =
          isSaleActive(product.saleStartDate, product.saleEndDate) &&
          product.salePrice !== null;
        effectivePrice = isProductOnSale ? product.salePrice! : product.price!;
      }

      // Multiply effective price by cart quantity, defaulting to 1 if cartQuantity is not defined
      return total + (effectivePrice / 100) * (cartQuantity || 1);
    },
    0
  );

  const steps = [
    { number: 1, title: "Asiakastiedot" },
    { number: 2, title: "Toimitustapa" },
  ];
  const handleCustomerDataSubmit = async (data: CustomerData) => {
    setIsLoading(true);
    setCustomerData(data);
    if (!data) {
      return;
    }

    try {
      const response = await getShipmentMethods(data.postal_code);
      setShipmentMethodsAndLocations(response);

      setStep(2);
    } catch (error) {
      toast({
        title: "Virhe haettaessa toimitustapoja",
        description:
          "Virhe haettaessa toimitustapoja, yritä myöhemmin uudestaan",
        className:
          "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
        action: (
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <div className="flex flex-col"></div>
          </div>
        ),
      });
      console.error("Error fetching payment methods:", error);
    }
    setIsLoading(false);
  };

  const handleStripeCheckout = async () => {
    if (!PAYMENT_METHODS.includes("stripe")) {
      alert("Stripe is not a valid payment method");
      return;
    }

    // Revalidate customer data with Zod schema
    const validationResult = customerDataSchema.safeParse(customerData);
    if (!validationResult.success) {
      console.error("Customer data validation failed:", validationResult.error);

      return;
    }

    // Use the validated data
    const validatedCustomerData = validationResult.data;
    try {
      const res = await createStripeCheckoutSession(
        items,
        cartTotal,
        chosenShipmentMethod,
        validatedCustomerData
      );

      if (res === null) {
        alert("Failed to create Stripe Checkout session");
        return;
      }

      if (typeof res === "object" && res.error) {
        console.error("CartError:", res.message);

        toast({
          title: "Jotain meni pieleen",
          description: res.message || "Tuotetta ei ole varastossa",
          className:
            "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
          action: (
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <div className="flex flex-col"></div>
            </div>
          ),
        });

        return;
      }

      // If res is a string (session URL), redirect or handle success

      router.push(res as string);
    } catch (error) {
      alert("Error creating Stripe Checkout session");
    }
  };

  const handleGoBack = () => {
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);

      // Reset data based on the new step
      if (newStep === 1) {
        // Reset data related to step 2
      }
    }
  };

  if (!PAYMENT_METHODS.includes("stripe")) {
    return notFound();
  }
  return (
    <div className="max-w-screen-2xl mx-auto px-4 mt-24 md:mt-48 mb-12">
      <CheckoutSteps currentStep={step} steps={steps} />

      {step === 1 && (
        <CustomerDataForm
          handleSubmit={handleCustomerDataSubmit}
          initialData={customerData}
          isLoading={isLoading}
        />
      )}

      {step === 2 && (
        <>
          <div className="mt-6 flex justify-start mx-auto max-w-2xl">
            <SelectShipmentMethod
              shipmentMethodsAndLocations={shipmentMethodsAndLocations}
              setChosenShipmentMethod={setChosenShipmentMethod}
            />
          </div>
          <div className="mt-12 flex justify-between items-center mx-auto max-w-2xl">
            <Button variant="gooeyRight" onClick={handleGoBack}>
              Takaisin
            </Button>
            <form action={handleStripeCheckout}>
              <CheckoutButton disabled={!chosenShipmentMethod} />
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default StripeCheckoutPage;
