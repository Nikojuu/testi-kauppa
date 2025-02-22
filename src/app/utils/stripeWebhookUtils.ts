import { OrderLineItems } from "./types";

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
