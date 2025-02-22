// "use client";

// import { useState } from "react";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MapPin } from "lucide-react";
// import Image from "next/image";
// import { DropInLocation, ShipmentMethods } from "@/app/utils/types";
// import { cn } from "@/lib/utils";
// import Subtitle from "../subtitle";

// const LOCATIONS_PER_PAGE = 6;

// export function SelectShipmentMethod({
//   allShipmentMethods,
//   chosenShipmentMethod,
//   setChosenShipmentMethod,
//   dropInLocations,
// }: {
//   allShipmentMethods: {
//     customShipmentMethods: ShipmentMethods[];
//     shipitShipmentMethods: ShipitShippingMethod[];
//   };
//   chosenShipmentMethod:
//     | ShipmentMethods
//     | ShipitShippingMethod
//     | DropInLocation
//     | null;
//   setChosenShipmentMethod: (
//     method: ShipmentMethods | ShipitShippingMethod | DropInLocation | null
//   ) => void;
//   dropInLocations: DropInLocation[];
// }) {
//   const [showAllLocations, setShowAllLocations] = useState(false);
//   const allMethods = [
//     ...allShipmentMethods.customShipmentMethods,
//     ...allShipmentMethods.shipitShipmentMethods,
//     ...dropInLocations,
//   ];

//   const visibleLocations = showAllLocations
//     ? dropInLocations
//     : dropInLocations.slice(0, LOCATIONS_PER_PAGE);

//   return (
//     <>
//       <Subtitle subtitle="Valitse toimitustapa" />
//       <RadioGroup
//         onValueChange={(value: string) => {
//           const selected = allMethods.find((method) => method.id === value);
//           if (selected) {
//             setChosenShipmentMethod(selected);
//           }
//         }}
//         value={chosenShipmentMethod?.id}
//         className="space-y-6 mx-auto max-w-2xl "
//       >
//         <Card>
//           <CardHeader>
//             <CardTitle>Postitus</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {allShipmentMethods.customShipmentMethods.map((method) => (
//               <ShipmentMethod key={method.id} method={method} />
//             ))}
//           </CardContent>
//         </Card>
//         {allShipmentMethods.shipitShipmentMethods.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Shipit Postitus</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {allShipmentMethods.shipitShipmentMethods.map((method) => (
//                 <ShipmentMethod key={method.id} method={method} />
//               ))}
//             </CardContent>
//           </Card>
//         )}
//         {dropInLocations.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Pakettiautomaatit</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
//                 {visibleLocations.map((method) => (
//                   <ParchelLockerShipmentMethod
//                     key={method.id}
//                     method={method}
//                   />
//                 ))}
//               </div>
//               {dropInLocations.length > LOCATIONS_PER_PAGE && (
//                 <div className="flex justify-center pt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowAllLocations(!showAllLocations)}
//                     className="w-full max-w-xs"
//                   >
//                     {showAllLocations
//                       ? "Näytä vähemmän automaatteja"
//                       : `Näytä lisää automaatteja (${
//                           dropInLocations.length - LOCATIONS_PER_PAGE
//                         })`}
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </RadioGroup>
//     </>
//   );
// }

// function ShipmentMethod({ method }) {
//   return (
//     <div
//       className={cn(
//         "flex items-center space-x-2 p-4 rounded-lg border",
//         "hover:bg-accent hover:text-accent-foreground",
//         "transition-colors duration-200"
//       )}
//     >
//       <RadioGroupItem
//         value={method.id}
//         id={method.id}
//         className="border-gray-500 text-gray-700 bg-white "
//       />
//       <Label
//         htmlFor={method.id}
//         className="flex justify-between w-full cursor-pointer"
//       >
//         <span>{method.name}</span>
//       </Label>
//     </div>
//   );
// }

// function ParchelLockerShipmentMethod({ method }: { method: DropInLocation }) {
//   return (
//     <div
//       className={cn(
//         "flex items-center   p-2 rounded-lg border",
//         "hover:bg-accent hover:text-accent-foreground",
//         "transition-colors duration-200"
//       )}
//     >
//       <RadioGroupItem
//         className="border-gray-500 text-gray-700 bg-white "
//         value={method.id}
//         id={method.id}
//       />
//       <Label
//         htmlFor={method.id}
//         className="flex flex-col items-start cursor-pointer w-full p-2 "
//       >
//         <div className="flex justify-between w-full ">
//           <span className="font-medium ">{method.name}</span>
//           <span className="text-sm text-muted-foreground ">
//             {method.merchantPrice! / 100} €
//           </span>
//         </div>
//         <div className="flex items-center text-sm text-muted-foreground space-x-1">
//           <MapPin className="h-3 w-3" />
//           <span>{method.distanceInKilometers} km away</span>
//         </div>
//         <div className="flex items-center justify-between w-full">
//           <span className="text-sm text-muted-foreground">
//             {method.carrier}
//           </span>
//           <Image
//             src={method.carrierLogo}
//             alt={method.carrier}
//             width={40}
//             height={40}
//             className="object-contain"
//           />
//         </div>
//       </Label>
//     </div>
//   );
// }
