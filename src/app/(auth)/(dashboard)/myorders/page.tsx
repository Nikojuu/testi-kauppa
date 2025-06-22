import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  Package,
  Calendar,
  Euro,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  Plane,
} from "lucide-react";

// Define the order status enum
enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  REFUNDED = "REFUNDED",
}

// Define the product interface for enhanced line items
interface ProductInfo {
  id: string;
  name: string;
  images: string[];
  slug: string | null;
  variationId?: string;
  optionName?: string;
  optionValue?: string;
  isShipping?: boolean;
  unavailable?: boolean;
}

// Define the order interface based on the API response
interface OrderLineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  itemType: string;
  productCode: string;
  product: ProductInfo;
}

interface Order {
  id: string;
  orderNumber: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  OrderLineItems: OrderLineItem[];
  trackingNumber: string | null;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

const getOrders = async (userId: string): Promise<OrdersResponse> => {
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

    const orders: OrdersResponse = await res.json();
    return orders;
  } catch (error) {
    throw new Error("Jotain meni vikaan");
  }
};

// Component to get status color and icon
const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-3 h-3" />,
        text: "Odottaa maksua",
      };
    case OrderStatus.PAID:
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CreditCard className="w-3 h-3" />,
        text: "Maksettu",
      };
    case OrderStatus.SHIPPED:
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Truck className="w-3 h-3" />,
        text: "Lähetetty",
      };
    case OrderStatus.COMPLETED:
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
        text: "Valmis",
      };
    case OrderStatus.REFUNDED:
      return {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: <Package className="w-3 h-3" />,
        text: "Palautettu",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Package className="w-3 h-3" />,
        text: status,
      };
  }
};

// Component for individual order card
const OrderCard = ({ order }: { order: Order }) => {
  const statusInfo = getStatusInfo(order.status);
  const orderDate = new Date(order.createdAt).toLocaleDateString("fi-FI");
  const totalAmountEur = (order.totalAmount / 100).toFixed(2);

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              Tilausnumero: {order.orderNumber}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {orderDate}
            </div>
          </div>
          <div className="text-right space-y-2">
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.text}</span>
            </Badge>
            <div className="flex items-center text-lg font-semibold">
              <Euro className="w-4 h-4 mr-1" />
              {totalAmountEur}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {" "}
          {/* Order Items */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Tilauksen tuotteet:
            </h4>
            <div className="space-y-3">
              {order.OrderLineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {/* Product Image */}
                    <div className="w-12 h-12 relative flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      {/* Show variation options if available */}
                      {item.product.optionName && item.product.optionValue && (
                        <p className="text-xs text-gray-500">
                          {item.product.optionName}: {item.product.optionValue}
                        </p>
                      )}
                      {/* Show if shipping item */}
                      {item.product.isShipping && (
                        <p className="text-xs text-blue-600">Toimitus</p>
                      )}
                      {/* Show if product unavailable */}
                      {item.product.unavailable && (
                        <p className="text-xs text-red-500">
                          Tuote ei enää saatavilla
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Määrä: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      €{(item.price / 100).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">
                        €{((item.price * item.quantity) / 100).toFixed(2)}{" "}
                        yhteensä
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Tracking Information */}
          {order.trackingNumber && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 mr-2" />
                  Seurantanumero:
                </div>
                <Badge variant="secondary" className="font-mono">
                  {order.trackingNumber}
                </Badge>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MyOrdersPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const ordersData = await getOrders(user.id);

  // Filter out cancelled and failed orders
  const filteredOrders =
    ordersData.orders?.filter(
      (order) =>
        order.status !== OrderStatus.CANCELLED &&
        order.status !== OrderStatus.FAILED
    ) || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Minun tilaukseni
        </h1>
        <p className="text-muted-foreground">
          Näet täältä kaikki tilauksesi ja niiden tilan
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Sinulla ei ole vielä tilauksia
            </h3>
            <p className="text-muted-foreground mb-6">
              Kun teet ensimmäisen tilauksesi, näet sen täältä
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Plane className="w-4 h-4 mr-2" />
              Aloita ostokset
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Yhteensä {filteredOrders.length} tilausta
            </p>
          </div>

          {filteredOrders
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
