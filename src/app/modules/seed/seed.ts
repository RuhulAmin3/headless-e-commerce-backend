import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
const prisma = new PrismaClient();

export async function seedData() {
  console.log("🌱 Seeding database...");
  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.promo.deleteMany();

  // Categories
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic gadgets and devices",
      images: ["https://via.placeholder.com/200x200?text=Electronics"],
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing",
      slug: "clothing",
      description: "Apparel and fashion items",
      images: ["https://via.placeholder.com/200x200?text=Clothing"],
    },
  });

  // Products with variants
  const phone = await prisma.product.create({
    data: {
      name: "Smartphone X",
      slug: "smartphone-x",
      description: "Latest Smartphone X with cool features",
      categoryId: electronics.id,
      images: ["https://via.placeholder.com/200x200?text=Phone"],
      isFeatured: true,
      variants: {
        create: [
          { name: "64GB Black", price: 699, stock: 50, isDefault: true },
          { name: "128GB Silver", price: 799, stock: 30 },
        ],
      },
    },
    include: { variants: true },
  });

  const tshirt = await prisma.product.create({
    data: {
      name: "Basic T-Shirt",
      slug: "basic-tshirt",
      description: "Comfortable cotton t-shirt",
      categoryId: clothing.id,
      images: ["https://via.placeholder.com/200x200?text=Tshirt"],
      variants: {
        create: [
          { name: "Small / Red", price: 20, stock: 100, isDefault: true },
          { name: "Large / Blue", price: 25, stock: 80 },
        ],
      },
    },
    include: { variants: true },
  });

  // Promos
  const percentPromo = await prisma.promo.create({
    data: {
      code: "SUMMER10",
      type: "PERCENT",
      value: 10,
      validFrom: new Date(),
      validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  const _fixedPromo = await prisma.promo.create({
    data: {
      code: "FLAT50",
      type: "FIXED",
      value: 50,
      minimumAmount: 200,
      validFrom: new Date(),
      validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  const cart = await prisma.cart.create({
    data: {
      token: randomBytes(16).toString("hex"),
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
      promoId: percentPromo.id,
      items: {
        create: [
          {
            variantId: phone.variants[0].id,
            quantity: 1,
            unitPrice: phone.variants[0].price,
            totalPrice: phone.variants[0].price * 1,
          },
          {
            variantId: tshirt.variants[1].id,
            quantity: 2,
            unitPrice: tshirt.variants[1].price,
            totalPrice: tshirt.variants[1].price * 2,
          },
        ],
      },
      subtotal: phone.variants[0].price + tshirt.variants[1].price * 2,
      discountAmount: 50,
      total: phone.variants[0].price + tshirt.variants[1].price * 2 - 50,
    },
    include: { items: true },
  });

  // Order from cart
  await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      cartId: cart.id,
      promoId: percentPromo.id,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      total: cart.total,
    },
  });

  console.log("✅ Seeding complete!");
}
