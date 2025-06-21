import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const getOrders = async (userId: string) => {
  if (!userId) {
    redirect("/login");
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/get-orders/${userId}`,
      {
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );

    if (!res.ok) {
      let errorMessage = "Failed to fetch orders";
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    const orders = await res.json();
    return orders;
  } catch (error) {
    throw new Error("Jotain meni vikaan");
  }
};

const MyOrdersPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login"); // Redirect to login if not authenticated
  }
  let orders = [];
  let error = null;
  try {
    orders = await getOrders(user.id);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "message" in err) {
      error = (err as { message: string }).message;
    } else {
      error = "Jotain meni vikaan";
    }
  }
  console.log("Orders:", orders);
  return (
    <div>
      <h1>Hello my orders</h1>
      {error ? (
        <div className="text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div>Sinulla ei ole vielä tilauksia</div>
      ) : (
        <div>{/* Render orders here */}</div>
      )}
    </div>
  );
};

export default MyOrdersPage;
