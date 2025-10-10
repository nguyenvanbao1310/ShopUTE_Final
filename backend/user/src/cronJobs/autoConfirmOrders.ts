// src/cronJobs/autoConfirmOrders.ts
import { Op } from "sequelize";
import { Order } from "../models";

export async function autoConfirmOrders() {
  try {
    const now = new Date();

    const nowVN = new Date();
    const thirtyMinutesAgoVN = new Date(nowVN.getTime() - 30 * 60 * 1000);

    const todayStartVN = new Date(nowVN);
    todayStartVN.setHours(0, 0, 0, 0);

    const orders = await Order.findAll({
      where: {
        status: "PENDING",
        createdAt: {
          [Op.lte]: thirtyMinutesAgoVN,
          [Op.gte]: todayStartVN,
        },
      },
    });

    console.log("🔍 Orders matched:", orders.length);

    for (const order of orders) {
      console.log(
        `👉 Auto-confirming order #${order.id}, createdAt=${order.createdAt}`
      );
      order.status = "CONFIRMED";
      await order.save();
    }

    if (orders.length > 0) {
      console.log(`✅ Auto-confirmed ${orders.length} orders`);
    } else {
      console.log("⚠️ No orders to auto-confirm");
    }
  } catch (error) {
    console.error("❌ Error in autoConfirmOrders:", error);
  }
}
