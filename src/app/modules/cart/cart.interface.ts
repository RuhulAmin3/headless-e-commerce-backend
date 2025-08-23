export type ICartItem = {
  variantId: string;
  quantity: number;
};

export type ICart = {
  token?: string;
  promoId?: string;
  items: ICartItem[];
};
