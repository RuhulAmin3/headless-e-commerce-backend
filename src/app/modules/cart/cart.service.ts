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

  await prisma.cart.update({
    where: { id: cartId },
    data: {
      subtotal: Math.round(subtotal),
      discountAmount: Math.round(discountAmount),
      total: Math.round(total),
    },
  });

  return { subtotal, discountAmount, total };
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
  variantId: string,
  quantity: number,
) => {
  const cart = await getOrCreateCart(token);

  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId,
      },
    },
    include: { variant: true },
  });

  if (!existingCartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    await prisma.cartItem.delete({ where: { id: existingCartItem.id } });
  } else {
    if (quantity > existingCartItem.variant.stock) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Not enough stock available");
    }
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity,
        totalPrice: quantity * existingCartItem.variant.price,
      },
    });
  }

  await calculateCartTotals(cart.id);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { variant: true } }, promo: true },
  });
};

const removeCartItem = async (token: string, variantId: string) => {
  const cart = await getOrCreateCart(token);
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId,
      },
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

export const cartServices = {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  getCart,
  applyPromoToCart,
  removePromoFromCart,
};
