import Address from "../models/Address";
import { where } from "sequelize";
import { Transaction } from "sequelize";
import sequelize from "../config/configdb";
import User from "../models/User"
import { Cart } from "../models";
import { trace } from "console";
export async function createAddress (userId: number, street:string,  ward: string , province: string , address: string, phone: string, isDefault?: boolean){
    const t =  await sequelize.transaction();
    try {
        const user = User.findByPk(userId,{ transaction: t });
        if(!user) throw new Error("User Not Found!")
        const count = await Address.count({ where: { userId }, transaction: t });
        let finalIsDefault = false;
        if (count === 0) {
            finalIsDefault = true;
        } else if (isDefault) {
            await Address.update(
                { isDefault: false },
                { where: { userId }, transaction: t }
        );
            finalIsDefault = true;
        }
        const add =  await Address.create({userId,street,ward,province,address,isDefault: finalIsDefault,phone},  { transaction: t });
        t.commit();
        return add
    } catch (error:any) {
        t.rollback();
        throw new Error(error.message || "Create Address Failed");
    }
}
export async function updateAddress (userId: number, addID: number , street:string,  ward: string , province: string , address: string,phone: string, isDefault?: boolean)
{
    const t =  await sequelize.transaction();
    try {
        const user = User.findByPk(userId,{ transaction: t });
        if(!user) throw new Error("User Not Found!")
        const addr = await Address.findOne({ where: { id: addID, userId }, transaction: t });
        if (!addr) throw new Error("Address Not Found!");
        if (isDefault) {
        await Address.update({ isDefault: false }, { where: { userId }, transaction: t });
        }
        const update =  await Address.update({street,ward,province,address,phone,isDefault: !!isDefault},   { where: { id: addID, userId }, transaction: t });
        t.commit();
        return update;
    } catch (error:any) {
        t.rollback();
        throw new Error(error.message || "Update Address Failed");
    }
}
export async function deleteAddress (userId: number, addID: number)
{
    const t =  await sequelize.transaction();
    try {
        const user = User.findByPk(userId,{ transaction: t });
        if(!user) throw new Error("User Not Found!")
        const addr = await Address.findOne({ where: { id: addID, userId }, transaction: t });
        if (!addr) throw new Error("Address Not Found!");
        await addr.destroy({ transaction: t });
        t.commit();
        return true;
    } catch (error:any) {
        t.rollback();
         throw new Error(error.message || "Delete Address Failed"); 
    }
}
export async function getDefaultAddress(userId: number) {
  try {
    const addr = await Address.findOne({
      where: { userId, isDefault: true },
    });

    if (!addr) {
      throw new Error("Default Address Not Found!");
    }

    return addr;
  } catch (error: any) {
    throw new Error(error.message || "Get Default Address Failed");
  }
}
export async function getAllAddress(userId: number) {
  try {
    const addr = await Address.findAll({
      where: { userId },
    });
    return addr;
  }
    catch (error: any) {
    throw new Error(error.message || "Get All Address Failed");
    }
}
export async function getAddressById(userId: number, addID: number) {
    try {
        const addr = await Address.findOne({
            where: { id: addID, userId },
        });
        if (!addr) {
            throw new Error("Address Not Found!");
        }
        return addr;
    } catch (error: any) {
        throw new Error(error.message || "Get Address By Id Failed");
    }
}
