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

// Component to get status color and icon with Pupun Korvat theme
const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return {
        color: "bg-champagne/20 text-charcoal border-champagne/40",
        icon: <Clock className="w-3 h-3" />,
        text: "Odottaa maksua",
      };
    case OrderStatus.PAID:
      return {
        color: "bg-rose-gold/20 text-charcoal border-rose-gold/40",
        icon: <CreditCard className="w-3 h-3" />,
        text: "Maksettu",
      };
    case OrderStatus.SHIPPED:
      return {
        color: "bg-rose-gold/30 text-charcoal border-rose-gold/50",
        icon: <Truck className="w-3 h-3" />,
        text: "Lähetetty",
      };
    case OrderStatus.COMPLETED:
      return {
        color: "bg-rose-gold/20 text-charcoal border-rose-gold/40",
        icon: <CheckCircle className="w-3 h-3" />,
        text: "Valmis",
      };
    case OrderStatus.REFUNDED:
      return {
        color: "bg-champagne/30 text-charcoal border-champagne/50",
        icon: <Package className="w-3 h-3" />,
        text: "Palautettu",
      };
    default:
      return {
        color: "bg-cream text-charcoal/70 border-rose-gold/20",
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
    <div className="group relative bg-warm-white p-6 mb-6 transition-all duration-300 hover:shadow-md">
      {/* Border frame */}
      <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none group-hover:border-rose-gold/25 transition-colors" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />

      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <h3 className="font-primary text-lg text-charcoal">
              Tilausnumero: {order.orderNumber}
            </h3>
            <div className="flex items-center text-sm font-secondary text-charcoal/60">
              <Calendar className="w-4 h-4 mr-2" />
              {orderDate}
            </div>
          </div>
          <div className="text-right space-y-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 border font-secondary text-xs tracking-wider uppercase ${statusInfo.color}`}
            >
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </div>
            <div className="flex items-center justify-end text-xl font-primary text-charcoal">
              <Euro className="w-5 h-5 mr-1" />
              {totalAmountEur}
            </div>
          </div>
        </div>

        <div className="mb-4 h-[1px] bg-gradient-to-r from-rose-gold/30 to-transparent" />

        <div className="space-y-3">
          {/* Order Items */}
          <div>
            <h4 className="text-sm font-secondary font-medium text-charcoal/70 mb-3">
              Tilauksen tuotteet:
            </h4>
            <div className="space-y-3">
              {order.OrderLineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-cream/30 border border-rose-gold/10"
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
                      <p className="text-sm font-secondary font-medium text-charcoal truncate">
                        {item.product.name}
                      </p>
                      {/* Show variation options if available */}
                      {item.product.optionName && item.product.optionValue && (
                        <p className="text-xs font-secondary text-charcoal/60">
                          {item.product.optionName}: {item.product.optionValue}
                        </p>
                      )}
                      {/* Show if shipping item */}
                      {item.product.isShipping && (
                        <p className="text-xs font-secondary text-rose-gold">
                          Toimitus
                        </p>
                      )}
                      {/* Show if product unavailable */}
                      {item.product.unavailable && (
                        <p className="text-xs font-secondary text-deep-burgundy">
                          Tuote ei enää saatavilla
                        </p>
                      )}
                      <p className="text-xs font-secondary text-charcoal/60">
                        Määrä: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-sm font-primary font-medium text-charcoal">
                      €{(item.price / 100).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-xs font-secondary text-charcoal/60">
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
              <div className="my-3 h-[1px] bg-gradient-to-r from-rose-gold/20 to-transparent" />
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm font-secondary text-charcoal/70">
                  <Truck className="w-4 h-4 mr-2 text-rose-gold" />
                  Seurantanumero:
                </div>
                <span className=" text-sm font-secondary text-charcoal bg-cream/50 px-3 py-1 border border-rose-gold/20">
                  {order.trackingNumber}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
          <h2 className="text-2xl md:text-3xl font-primary text-charcoal">
            Minun tilaukseni
          </h2>
        </div>
        <p className="font-secondary text-charcoal/60 ml-5">
          Näet täältä kaikki tilauksesi ja niiden tilan
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="relative bg-warm-white p-12 text-center">
          <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-rose-gold/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-rose-gold/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-rose-gold/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-rose-gold/30" />
          <div className="relative">
            <Package className="w-16 h-16 text-charcoal/20 mx-auto mb-6" />
            <h3 className="text-xl font-primary text-charcoal mb-3">
              Sinulla ei ole vielä tilauksia
            </h3>
            <p className="text-sm font-secondary text-charcoal/60 mb-6">
              Kun teet ensimmäisen tilauksesi, näet sen täältä
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold"
            >
              <Plane className="w-4 h-4" />
              Aloita ostokset
            </a>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <p className="text-sm font-secondary text-charcoal/60">
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
