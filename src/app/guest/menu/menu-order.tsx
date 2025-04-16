"use client";
import Image from "next/image";
import { useGetDishList } from "@/queries/useDish";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import Quantity from "./quantity";
import { formatCurrency } from "@/lib/utils";

export default function MenuOrder() {
  const { data } = useGetDishList();
  const dishes = data?.payload.data ?? [];
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

  const totalPrice = dishes.reduce((result, dish) => {
    const order = orders.find((order) => order.dishId === dish.id);
    if (!order) return result;
    return result + dish.price * order.quantity;
  }, 0);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId === dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  return (
    <div>
      {dishes.map((dish) => (
        <div key={dish.id} className="flex gap-4">
          <div className="flex-shrink-0">
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{dish.name}</h3>
            <p className="text-xs">{dish.description}</p>
            <p className="text-xs font-semibold">
              {formatCurrency(dish.price)}
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Quantity
              value={
                orders.find((order) => order.dishId === dish.id)?.quantity ?? 0
              }
              onChange={(value) => handleQuantityChange(dish.id, value)}
            />
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </div>
  );
}
