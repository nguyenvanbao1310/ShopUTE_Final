import { Op, Sequelize } from "sequelize";
import Voucher from "../models/Voucher";
import { VoucherAttributes  } from "../types/voucher";
export const createVoucher = async (data: VoucherAttributes) => {
  return await Voucher.create(data);
};
export const getAllVouchers = async () => {
  return await Voucher.findAll();
};
export const getVoucherByCode = async (code: string) => {
  const now = new Date();
  return await Voucher.findOne({ 
    where: { 
      code, 
      expiredAt: { [Op.gte]: now } 
    } 
  });   
}
export const updateVoucher = async (id: number, data: Partial<VoucherAttributes>) => {
  const voucher = await Voucher.findByPk(id);
  if (!voucher) return null;
  return await voucher.update(data);
};
export const deleteVoucher = async (id: number) => {
  const voucher = await Voucher.findByPk(id);
  if (!voucher) return null;
  await voucher.destroy();
  return true;
};

export const getBestVouchersForOrder = async (orderTotal: number) => {
  const now = new Date();

  return await Voucher.findAll({
    where: {
      expiredAt: { [Op.gte]: now },
      [Op.or]: [
        { minOrderValue: null },
        { minOrderValue: { [Op.lte]: orderTotal } },
      ],
    },
    attributes: {
      include: [
        [
          Sequelize.literal(`
            CASE 
              WHEN discountType = 'FIXED' 
                THEN CAST(discountValue AS DECIMAL(14,2)) 
              WHEN discountType = 'PERCENT' 
                THEN LEAST(
                  (CAST(discountValue AS DECIMAL(5,2)) / 100) * ${orderTotal},
                  COALESCE(CAST(maxDiscountValue AS DECIMAL(14,2)), (CAST(discountValue AS DECIMAL(5,2)) / 100) * ${orderTotal})
                )
              ELSE 0
            END
          `),
          "estimatedDiscount",
        ],
      ],
    },
    order: [
      [Sequelize.literal("estimatedDiscount"), "DESC"],
      ["expiredAt", "ASC"],
    ],
  });
};
