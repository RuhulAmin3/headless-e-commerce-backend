import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { ICartItem } from "./cart.interface";
import { randomBytes } from "crypto";
import { promoServices } from "../promo/promo.service";
import config from "../../../config";

const calculateCartTotals = async (cartId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { variant: true } }, promo: true },
  });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  let subtotal = 0;

  for (const item of cart.items) {
    subtotal += item.quantity * item.unitPrice;
  }

  let discountAmount = 0;

  if (cart.promo) {
    const { discount } = await promoServices.applyPromo(
      cart.promo.code,
      subtotal,
    );
    discountAmount = discount;
  }

  const total = subtotal - discountAmount;

  const calculatedAmount = {
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    total: Math.round(total),
  };

  await prisma.cart.update({
    where: { id: cartId },
    data: calculatedAmount,
  });

  return calculatedAmount;
};

const getOrCreateCart = async (token?: string) => {
  let cart;

  if (token) {
    cart = await prisma.cart.findUnique({
      where: { token },
      include: { items: { include: { variant: true } }, promo: true },
    });

    // If cart exists but is expired, create a new one
    if (cart && cart.expiresAt < new Date()) {
      await prisma.cart.delete({ where: { id: cart.id } });
      cart = null;
    }
  }

  if (!cart) {
    const newToken = randomBytes(16).toString("hex");
    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + Number(config.cart_expiry_days) || 7,
    );

    cart = await prisma.cart.create({
      data: {
        token: newToken,
        expiresAt,
      },
      include: { items: { include: { variant: true } }, promo: true },
    });
  }

  return cart;
};

const addItemToCart = async (token: string, payload: ICartItem) => {
  const cart = await getOrCreateCart(token);

  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId: payload.variantId,
      },
    },
  });

  const variant = await prisma.variant.findUnique({
    where: { id: payload.variantId },
  });

  if (!variant) {
    throw new ApiError(httpStatus.NOT_FOUND, "Variant not found");
  }

  if (payload.quantity > variant.stock) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not enough stock available");
  }

  if (existingCartItem) {
    const _cartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + payload.quantity,
        totalPrice: Math.round(
          (existingCartItem.quantity + payload.quantity) * variant.price,
        ),
      },
    });
  } else {
    const _cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId: payload.variantId,
        quantity: payload.quantity,
        unitPrice: variant.price,
        totalPrice: payload.quantity * variant.price,
      },
    });
  }

  await calculateCartTotals(cart.id);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } }, promo: true },
  });
};

const updateCartItemQuantity = async (
  token: string,
  cartItemId: string,
  quantity: number,
) => {
  const cart = await getOrCreateCart(token);

  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: { variant: true },
  });

  if (!existingCartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  const totalQuantity = quantity + existingCartItem.quantity;

  if (totalQuantity <= 0) {
    // Remove item if totalQuantity is 0 or less
    await prisma.cartItem.delete({ where: { id: existingCartItem.id } });
  } else {
    if (quantity > existingCartItem.variant.stock) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Not enough stock available");
    }
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: totalQuantity,
        totalPrice: totalQuantity * existingCartItem.variant.price,
      },
    });
  }

  await calculateCartTotals(cart.id);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } }, promo: true },
  });
};

const removeCartItem = async (token: string, cartItemId: string) => {
  const cart = await getOrCreateCart(token);
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
  });

  if (!existingCartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  await prisma.cartItem.delete({ where: { id: existingCartItem.id } });

  await calculateCartTotals(cart.id);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } }, promo: true },
  });
};

const getCart = async (token: string) => {
  const cart = await getOrCreateCart(token);
  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } }, promo: true },
  });
};

const applyPromoToCart = async (token: string, promoCode: string) => {
  const cart = await getOrCreateCart(token);
  const promo = await prisma.promo.findUnique({
    where: { code: promoCode },
  });

  if (!promo) {
    throw new ApiError(httpStatus.NOT_FOUND, "Promo not found");
  }

  if (cart.promoId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Promo already applied to cart");
  }

  // Check promo validity using promoService's applyPromo logic (without incrementing usageCount yet)
  try {
    await promoServices.applyPromo(promoCode, cart.subtotal);
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { promoId: promo.id },
  });

  await calculateCartTotals(cart.id);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } }, promo: true },
  });
};

const removePromoFromCart = async (token: string) => {
  const cart = await getOrCreateCart(token);

  if (!cart.promoId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No promo applied to cart");
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { promoId: null },
  });

  await calculateCartTotals(cart.id);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } }, promo: true },
  });
};

const checkoutFromCart = async (cartToken: string) => {
  if (!cartToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart token is required");
  }

  const cart = await prisma.cart.findUnique({
    where: { token: cartToken },
    include: { items: { include: { variant: true } }, promo: true },
  });

  if (!cart) throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");

  if (cart.items.length === 0)
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");

  const recalc = await calculateCartTotals(cart.id);
  if (recalc.total <= 0)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Total must be greater than zero",
    );

  // Transaction only for critical operations
  const newOrder = await prisma.$transaction(
    async (tsx) => {
      //  Decrement stock in parallel
      await Promise.all(
        cart.items.map((item) => {
          if (item.quantity > item.variant.stock) {
            throw new ApiError(
              httpStatus.BAD_REQUEST,
              `Not enough stock for variant ${item.variantId}`,
            );
          }

          return tsx.variant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }),
      );

      //  Create order + items
      const order = await tsx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          subtotal: recalc.subtotal,
          token: cart.token,
          discountAmount: recalc.discountAmount,
          total: recalc.total,
          promoId: cart.promoId ?? undefined,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.unitPrice,
            })),
          },
        },
      });

      //  Update promo usage
      if (cart.promoId) {
        await tsx.promo.update({
          where: { id: cart.promoId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return order;
    },
    { timeout: 20000 },
  );

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      subtotal: 0,
      discountAmount: 0,
      total: 0,
      promoId: null,
      updatedAt: new Date(),
    },
  });

  return newOrder;
};

export const cartServices = {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  getCart,
  applyPromoToCart,
  removePromoFromCart,
  checkoutFromCart,
};
