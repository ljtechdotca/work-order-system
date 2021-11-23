import { Order } from ".prisma/client";

export interface IOrder extends Order {
  user: {
    name: string;
  };
}
