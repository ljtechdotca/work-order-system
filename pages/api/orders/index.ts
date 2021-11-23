import { Order, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type Data = {
  status: boolean;
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;

  let orders: Order[] = [];
  let order: Order | null = null;

  prisma.$connect();

  try {
    switch (method) {
      case "GET":
        orders = await prisma.order.findMany({
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        });
        orders.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        res
          .status(200)
          .json({ status: true, message: "Orders Read", data: { orders } });
        break;
      case "POST":
        order = await prisma.order.create({
          data: {
            description: body.description,
            tag: body.tag,
            title: body.title,
            userId: body.userId,
          },
        });
        if (!order) throw new Error("No Order Created");
        res
          .status(200)
          .json({ status: true, message: "Order Created", data: { order } });
        break;
      default:
        res
          .status(400)
          .json({ status: false, message: "Bad Method", data: null });
        break;
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Internal Error", data: null });
    prisma.$disconnect();
  }
}
