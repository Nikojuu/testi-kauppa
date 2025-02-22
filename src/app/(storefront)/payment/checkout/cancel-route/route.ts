// import { calculateHmac } from "@/app/utils/calculateHmac";

// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const checkoutParams: Record<string, string> = {};
//   searchParams.forEach((value, key) => {
//     if (key.startsWith("checkout-")) {
//       checkoutParams[key] = value;
//     }
//   });

//   const receivedSignature = searchParams.get("signature");
//   const calculatedSignature = calculateHmac(
//     process.env.PAYTRAIL_MERCHANT_SECRET!,
//     checkoutParams,
//     null
//   );

//   if (receivedSignature !== calculatedSignature) {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   const reference = checkoutParams["checkout-reference"];

//   try {
//     await prisma.order.delete({
//       where: { id: reference, storeId: process.env.TENANT_ID },
//     });

//     return NextResponse.redirect(new URL("/payment/cancel", request.url));
//   } catch (error) {
//     console.error("Error Deleting from order from database", error);
//   }
// }
