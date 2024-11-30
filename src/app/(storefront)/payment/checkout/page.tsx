// // CheckoutPage.tsx
// "use client";

// import React, { useState } from "react";
// import {
//   getDropInLocations,
//   getShipmentMethods,
//   payTrailCheckout,
// } from "@/app/actions";
// import CustomerDataForm from "@/components/Checkout/CustomerDataForm";
// import { useCart } from "@/hooks/use-cart";
// import { CustomerData } from "@/lib/zodSchemas";
// import { Button } from "@/components/ui/button";
// import type { ShipitShippingMethod, ShipmentMethods } from "@prisma/client";
// import { SelectShipmentMethod } from "@/components/Checkout/SelectShipmentMethod";
// import PaytrailCheckout, {
//   PaytrailResponse,
// } from "@/components/Checkout/PaytrailPayments";
// import { DropInLocation } from "@/app/utils/types";
// import { useToast } from "@/hooks/use-toast";
// import { XCircle } from "lucide-react";
// import { CheckoutSteps } from "@/components/Checkout/CheckoutSteps";

// const CheckoutPage = () => {
//   const items = useCart((state) => state.items);
//   const { toast } = useToast();
//   const [customerData, setCustomerData] = useState<CustomerData | null>(null);
//   const [shipmentMethods, setShipmentMethods] = useState<{
//     customShipmentMethods: ShipmentMethods[];
//     shipitShipmentMethods: ShipitShippingMethod[];
//   } | null>(null);

//   const [chosenShipmentMethod, setChosenShipmentMethod] = useState<
//     ShipitShippingMethod | ShipmentMethods | DropInLocation | null
//   >(null);

//   const [paytrailData, setPaytrailData] = useState<PaytrailResponse | null>(
//     null
//   );

//   const [dropInLocations, setDropInLocations] = useState<DropInLocation[]>([]);

//   const [step, setStep] = useState(1);

//   const handleCustomerDataSubmit = async (data: CustomerData) => {
//     setCustomerData(data);

//     try {
//       const response = await getShipmentMethods();
//       setShipmentMethods(response);

//       const fetchDropInLocations = await getDropInLocations({
//         customerPostalCode: data.postal_code,
//       });

//       setDropInLocations(fetchDropInLocations);
//       setStep(2);
//     } catch (error) {
//       console.error("Error fetching payment methods:", error);
//     }
//   };

//   const paytrailPaymentMethods = async () => {
//     if (!customerData || !chosenShipmentMethod) {
//       toast({
//         title: "Toimitustapaa tai asiakastietoja puuttuu",
//         description:
//           "Tarkista että olet valinnut toimitustavan ja täyttänyt asiakastiedot",
//         className:
//           "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
//         action: (
//           <div className="flex items-center space-x-2">
//             <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
//             <div className="flex flex-col"></div>
//           </div>
//         ),
//       });
//       return;
//     }

//     try {
//       const response = await payTrailCheckout(
//         items,
//         customerData,
//         chosenShipmentMethod
//       );

//       if (response.error) {
//         console.error("CartError:", response.message);
//         const { productId, variationId } = response;

//         if (productId) {
//           toast({
//             title: "Hinta on muuttunut",
//             description: response.message || "Tuotetta ei ole varastossa",
//             className:
//               "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
//             action: (
//               <div className="flex items-center space-x-2">
//                 <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
//                 <div className="flex flex-col"></div>
//               </div>
//             ),
//           });
//         }

//         return;
//       }

//       setPaytrailData(response);

//       if (response.providers && response.providers.length > 0) {
//         setStep(3);
//       } else {
//         console.warn("No payment providers available.");
//       }
//     } catch (error) {
//       console.error("Error fetching payment methods:", error);
//       toast({
//         title: "Virhe tilauksen maksamisessa",
//         description: error instanceof Error ? error.message : "Unknown error",
//         className:
//           "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
//         action: (
//           <div className="flex items-center space-x-2">
//             <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
//             <div className="flex flex-col"></div>
//           </div>
//         ),
//       });
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <CheckoutSteps currentStep={step} />

//       {(!customerData || step === 1) && (
//         <CustomerDataForm handleSubmit={handleCustomerDataSubmit} />
//       )}

//       {customerData && shipmentMethods && step === 2 && (
//         <>
//           <SelectShipmentMethod
//             allShipmentMethods={shipmentMethods}
//             chosenShipmentMethod={chosenShipmentMethod}
//             setChosenShipmentMethod={setChosenShipmentMethod}
//             dropInLocations={dropInLocations}
//           />

//           <form
//             action={paytrailPaymentMethods}
//             className="flex w-full items-center justify-center py-8"
//           >
//             <Button>Siirry maksamaan tilaus</Button>
//           </form>
//         </>
//       )}

//       {paytrailData && step === 3 && (
//         <PaytrailCheckout paytrailData={paytrailData} />
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;
"use client";

import React, { useState } from "react";
import {
  getDropInLocations,
  getShipmentMethods,
  payTrailCheckout,
} from "@/app/actions";
import CustomerDataForm from "@/components/Checkout/CustomerDataForm";
import { useCart } from "@/hooks/use-cart";
import { CustomerData } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import type { ShipitShippingMethod, ShipmentMethods } from "@prisma/client";
import { SelectShipmentMethod } from "@/components/Checkout/SelectShipmentMethod";
import PaytrailCheckout, {
  PaytrailResponse,
} from "@/components/Checkout/PaytrailPayments";
import { DropInLocation } from "@/app/utils/types";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { CheckoutSteps } from "@/components/Checkout/CheckoutSteps";

const CheckoutPage = () => {
  const items = useCart((state) => state.items);
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [shipmentMethods, setShipmentMethods] = useState<{
    customShipmentMethods: ShipmentMethods[];
    shipitShipmentMethods: ShipitShippingMethod[];
  } | null>(null);

  const [chosenShipmentMethod, setChosenShipmentMethod] = useState<
    ShipitShippingMethod | ShipmentMethods | DropInLocation | null
  >(null);

  const [paytrailData, setPaytrailData] = useState<PaytrailResponse | null>(
    null
  );

  const [dropInLocations, setDropInLocations] = useState<DropInLocation[]>([]);

  const [step, setStep] = useState(1);

  const handleCustomerDataSubmit = async (data: CustomerData) => {
    setCustomerData(data);

    try {
      const response = await getShipmentMethods();
      setShipmentMethods(response);

      const fetchDropInLocations = await getDropInLocations({
        customerPostalCode: data.postal_code,
      });

      setDropInLocations(fetchDropInLocations);
      setStep(2);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const paytrailPaymentMethods = async () => {
    if (!customerData || !chosenShipmentMethod) {
      toast({
        title: "Toimitustapaa tai asiakastietoja puuttuu",
        description:
          "Tarkista että olet valinnut toimitustavan ja täyttänyt asiakastiedot",
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

    try {
      const response = await payTrailCheckout(
        items,
        customerData,
        chosenShipmentMethod
      );

      if (response.error) {
        console.error("CartError:", response.message);
        const { productId, variationId } = response;

        if (productId) {
          toast({
            title: "Hinta on muuttunut",
            description: response.message || "Tuotetta ei ole varastossa",
            className:
              "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
            action: (
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <div className="flex flex-col"></div>
              </div>
            ),
          });
        }

        return;
      }

      setPaytrailData(response);

      if (response.providers && response.providers.length > 0) {
        setStep(3);
      } else {
        console.warn("No payment providers available.");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast({
        title: "Virhe tilauksen maksamisessa",
        description: error instanceof Error ? error.message : "Unknown error",
        className:
          "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
        action: (
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <div className="flex flex-col"></div>
          </div>
        ),
      });
    }
  };

  const handleGoBack = () => {
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);

      // Reset data based on the new step
      if (newStep === 1) {
        // Reset data related to step 2
        setShipmentMethods(null);
        setChosenShipmentMethod(null);
        setDropInLocations([]);
      } else if (newStep === 2) {
        // Reset data related to step 3
        setPaytrailData(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps currentStep={step} />

      {step === 1 && (
        <CustomerDataForm
          handleSubmit={handleCustomerDataSubmit}
          initialData={customerData}
        />
      )}

      {step === 2 && shipmentMethods && (
        <>
          <SelectShipmentMethod
            allShipmentMethods={shipmentMethods}
            chosenShipmentMethod={chosenShipmentMethod}
            setChosenShipmentMethod={setChosenShipmentMethod}
            dropInLocations={dropInLocations}
          />
          <div className="mt-6 flex justify-between items-center mx-auto max-w-2xl">
            <Button variant="gooeyRight" onClick={handleGoBack}>
              Takaisin
            </Button>
            <form action={paytrailPaymentMethods} className="flex items-center">
              <Button>Siirry maksamaan tilaus</Button>
            </form>
          </div>
        </>
      )}

      {step === 3 && paytrailData && (
        <>
          <PaytrailCheckout paytrailData={paytrailData} />
          <div className="mt-6 flex justify-start mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <Button variant="gooeyRight" onClick={handleGoBack}>
              Takaisin
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
