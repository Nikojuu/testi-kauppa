"use client";

import { useState } from "react";

import CustomerDataForm from "@/components/Checkout/CustomerDataForm";
import { useCart } from "@/hooks/use-cart";
import { CustomerData, customerDataSchema } from "@/lib/zodSchemas";
import { SelectShipmentMethod } from "@/components/Checkout/SelectShipmentMethod";
import { Campaign, ShipmentMethodsWithLocations } from "@/app/utils/types";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { CheckoutSteps } from "@/components/Checkout/CheckoutSteps";

import { getShipmentMethods } from "@/lib/actions/shipmentActions";

import { useRouter } from "next/navigation";
import { CheckoutButton } from "../Cart/CheckoutButton";
import { apiCreateStripeCheckoutSession } from "@/lib/actions/stripeActions";

export type ChosenShipmentType = {
  shipmentMethodId: string;
  pickupId: string | null;
};

const StripeCheckoutPage = ({ campaigns }: { campaigns: Campaign[] }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [shipmentMethodsAndLocations, setShipmentMethodsAndLocations] =
    useState<ShipmentMethodsWithLocations | null>(null);
  const [step, setStep] = useState(1);
  const [chosenShipmentMethod, setChosenShipmentMethod] =
    useState<ChosenShipmentType | null>(null);

  const router = useRouter();

  const freeShippingCampaign = campaigns.find(
    (campaign) => campaign.type === "FREE_SHIPPING"
  );

  const buyXPayYCampaign = campaigns.find(
    (campaign) => campaign.type === "BUY_X_PAY_Y"
  );

  const steps = [
    { number: 1, title: "Asiakastiedot" },
    { number: 2, title: "Toimitustapa" },
    { number: 3, title: "Tilausvahvistus" },
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
      console.log("data", customerData);

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
    // Revalidate customer data with Zod schema
    const validationResult = customerDataSchema.safeParse(customerData);
    if (!validationResult.success) {
      console.error("Customer data validation failed:", validationResult.error);

      return;
    }

    // Use the validated data
    const validatedCustomerData = validationResult.data;

    const res = await apiCreateStripeCheckoutSession(
      chosenShipmentMethod,
      validatedCustomerData
    );
    router.push(res.url);
    setIsLoading(false);
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
          <div className="mt-6 flex justify-start mx-auto max-w-screen-2xl">
            <SelectShipmentMethod
              shipmentMethodsAndLocations={shipmentMethodsAndLocations}
              setChosenShipmentMethod={setChosenShipmentMethod}
              freeShippingCampaign={freeShippingCampaign}
              buyXPayYCampaign={buyXPayYCampaign}
            />
          </div>
          <div className="mt-12 flex justify-between items-center mx-auto max-w-2xl gap-4">
            <button
              onClick={handleGoBack}
              className="group inline-flex items-center gap-2 px-6 py-3 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span>Takaisin</span>
            </button>
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
