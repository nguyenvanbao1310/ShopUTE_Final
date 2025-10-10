import User from "../models/User";
import bcrypt from "bcrypt";
import {where} from "sequelize";
import { UpdateUserData } from "../types/user";
import { sendOTPEmail } from "./mailer";
const SALT = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const OTP_MIN = Number(10);
const genOTP = () => Math.floor(100000 + Math.random() * 900000);
const getInforUser = async (userId: number) => {
    try {
        const user = await User.findOne({
            where: {
                id: userId
            }, attributes: ["firstName", "lastName", "phone", "email", "gender", "birthday","avatar_url","loyaltyPoints"]
        });
        return user;
    } catch (error) {
        throw error;
    }
};

const updateInforUser = async (userId: number, data: UpdateUserData ) => {
   try{
       await User.update(data, {
           where: {
               id: userId
           }
       });
       return true;
   }
   catch(error){
    throw error;
   }   
};

const changePasswordUser = async (userId: number, currentPassword: string, newPassword: string) : Promise<{ otp: number; email: string }>  => {
    try {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new Error("Current password is incorrect");
        const otp = genOTP();
        const otpHash = await bcrypt.hash(String(otp), SALT);
        const expire = new Date(Date.now() + OTP_MIN * 60 * 1000);

        user.otp = otpHash;
        user.otpExpire = expire;
        await user.save();
        return { otp, email: user.email };
    } catch (error) {
        throw error;
    }
};
export const confirmChangePasswordOtp = async (
  userId: number,
  otp: string,
  newPassword: string
) => {
  const user = await User.findByPk(userId);
  if (!user || !user.otp || !user.otpExpire) {
    throw new Error("No OTP found. Please request again.");
  }
  if (new Date(user.otpExpire).getTime() < Date.now()) {
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    throw new Error("OTP expired");
  }
  const isValid = await bcrypt.compare(otp, user.otp);
  if (!isValid) throw new Error("Invalid OTP");
  const hashed = await bcrypt.hash(newPassword, SALT);
  user.password = hashed;
  user.otp = null;
  user.otpExpire = null;
  await user.save();
  return { message: "Password changed successfully" };
};

export default {
    getInforUser,
    updateInforUser,
    changePasswordUser,
    confirmChangePasswordOtp
};