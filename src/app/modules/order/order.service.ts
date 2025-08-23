import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Prisma, OrderStatus } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";

const getAllOrders = async (
  query: { status?: OrderStatus; searchTerm?: string },
  paginationOptions: IPaginationOptions,
) => {
  const { status, searchTerm } = query;

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (status) {
    andConditions.push({ status });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [{ orderNumber: { contains: searchTerm, mode: "insensitive" } }],
    });
  }

  const whereCondition: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const orders = await prisma.order.findMany({
    where: whereCondition,
    include: {
      items: { include: { variant: true } },
      promo: true,
    },
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
  });

  const total = await prisma.order.count({ where: whereCondition });

  const meta = { page, limit, total };
  return { data: orders, meta };
};

const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { variant: true } },
      promo: true,
    },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Prevent invalid status transitions
  if (order.status === "CANCELLED" || order.status === "DELIVERED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Order already ${order.status.toLowerCase()}, cannot update further`,
    );
  }

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!validTransitions[order.status].includes(newStatus)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid status transition from ${order.status} to ${newStatus}`,
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: newStatus, updatedAt: new Date() },
  });

  return updatedOrder;
};

const cancelOrder = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.status === "CANCELLED") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order already cancelled");
  }

  if (order.status === "DELIVERED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Delivered orders cannot be cancelled",
    );
  }

  const cancelledOrder = await prisma.$transaction(async (tsx) => {
    // Restore stock
    await Promise.all(
      order.items.map((item) =>
        tsx.variant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    );

    // Update status
    return tsx.order.update({
      where: { id },
      data: { status: "CANCELLED", updatedAt: new Date() },
    });
  });

  return cancelledOrder;
};

// Delete Order (admin use only)
const deleteOrder = async (id: string) => {
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // only allow deletion for cancelled orders
  if (order.status !== "CANCELLED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only cancelled orders can be deleted",
    );
  }

  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  const deletedOrder = await prisma.order.delete({ where: { id } });

  return deletedOrder;
};

const getOrderAnalytics = async () => {
  const analytics = await prisma.order.aggregate({
    _count: {
      _all: true,
    },
    _sum: {
      total: true,
    },
    _avg: {
      total: true,
    },
  });

  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  return {
    totalOrders: analytics._count._all,
    totalRevenue: analytics._sum.total,
    averageOrderValue: analytics._avg.total,
    statusCounts,
  };
};

export const orderServices = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderAnalytics,
};
