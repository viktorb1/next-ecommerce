import React from "react";
import { GET } from "@/app/api/orders/route";
import { formatPrice } from "@/util/priceFormat";
import Image from "next/image";

export const revalidate = 0;

const fetchOrders = async () => {
  const response = await (await GET()).json();
  return response;
};

const Dashboard = async () => {
  const orders = await fetchOrders();
  console.log("alskdjfd", orders);

  if (!orders) return <div>You need to be logged in to view your orders</div>;
  if (orders.length === 0)
    return (
      <div>
        <h1>No orders placed</h1>
      </div>
    );

  return (
    <div>
      <div className="font-medium">
        <h1 className="text-bold">Your Orders</h1>
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg p-8 my-12 bg-teal-100">
            <h2>Order reference: {order.id}</h2>
            <p>Time: {order.createdDate}</p>
            <p className="text-md py-2">
              Status:{" "}
              <span
                className={`${
                  order.status === "complete" ? "bg-teal-500" : "bg-orange-500"
                } text-white p-1 rounded-md px-2 mx-2 text-sm`}
              >
                {order.status}
              </span>
            </p>
            <p className="font-medium">Total: {formatPrice(order.amount)}</p>
            <div className="flex items-center gap-8">
              {order.products.map((product) => (
                <div className="py-2" key={product.id}>
                  <h2 className="py-2">{product.name}</h2>
                  <div className="flex items-center gap-4">
                    <Image src={product.image} width={36} height={36} alt={product.name} />
                  </div>
                  <p>{formatPrice(product.unit_amount)}</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
