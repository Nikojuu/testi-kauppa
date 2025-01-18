import prisma from "./db";

export async function restoreItemQuantitys(
  orderId: string,
  status: "FAILED" | "CANCELLED"
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId, storeId: process.env.TENANT_ID },
    include: { OrderLineItems: true },
  });

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  // Restore quantities
  for (const item of order.OrderLineItems) {
    if (item.itemType === "VARIATION") {
      await prisma.productVariation.update({
        where: { id: item.productCode },
        data: {
          quantity: { increment: item.quantity },
        },
      });
    } else if (item.itemType === "PRODUCT") {
      await prisma.product.update({
        where: { id: item.productCode },
        data: {
          quantity: { increment: item.quantity },
        },
      });
    }
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId, storeId: process.env.TENANT_ID },
    data: { status },
  });

  console.log(`Order ${orderId} has been ${status.toLowerCase()}.`);
}
