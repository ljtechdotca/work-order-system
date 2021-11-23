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
  const {
    body,
    method,
    query: { id },
  } = req;

  let orderId = id as string;
  let order: Order | null = null;

  prisma.$connect();

  try {
    switch (method) {
      case "GET":
        order = await prisma.order.findUnique({
          where: {
            id: orderId,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        });
        res
          .status(200)
          .json({ status: true, message: "Order Read", data: { order } });
        break;
      case "PUT":
        order = await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            description: body.description,
            tag: body.tag,
          },
        });
        if (!order) throw new Error("No Order Updated");
        res
          .status(200)
          .json({ status: true, message: "Order Updated", data: { order } });
        break;
      case "DELETE":
        order = await prisma.order.delete({
          where: {
            id: orderId,
          },
        });
        if (!order) throw new Error("No Order Deleted");
        res
          .status(200)
          .json({ status: true, message: "Order Deleted", data: { order } });
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
