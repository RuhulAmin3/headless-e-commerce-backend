import { PromoStatus, PromoType } from "@prisma/client";

export type IPromo = {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  usageLimit?: number;
  usageCount: number;
  minimumAmount?: number;
  maximumAmount?: number;
  status: PromoStatus;
  validFrom: Date;
  validTo: Date;
};
