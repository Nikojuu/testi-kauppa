import { OrderLineItems } from "@prisma/client";
import prisma from "./db";

export function calculateAverageVat(items: OrderLineItems[]): number {
  const nonShippingItems = items.filter((item) => item.itemType !== "SHIPPING");

  let totalVAT = 0;
  let totalPrice = 0;

  for (const item of nonShippingItems) {
    totalVAT += item.price * item.quantity * (item.vatRate / 100);
    totalPrice += item.price * item.quantity;
  }

  return totalPrice === 0 ? 0 : (totalVAT / totalPrice) * 100;
}

export async function processInventoryUpdates(items: OrderLineItems[]) {
  for (const item of items) {
    switch (item.itemType) {
      case "VARIATION":
        await prisma.productVariation.update({
          where: { id: item.productCode },
          data: { soldQuantity: { increment: item.quantity } },
        });
        break;
      case "PRODUCT":
        await prisma.product.update({
          where: { id: item.productCode },
          data: { soldQuantity: { increment: item.quantity } },
        });
        break;
      case "SHIPPING":
        console.log("Shipping cost item processed");
        break;
      default:
        throw new Error(`Unknown item type: ${item.itemType}`);
    }
  }
}
