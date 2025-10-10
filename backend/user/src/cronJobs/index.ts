// src/cronJobs/index.ts
import cron from "node-cron";
import { autoConfirmOrders } from "./autoConfirmOrders";

export function startCronJobs() {
  // chạy mỗi phút
  cron.schedule(" */30 * * * *", async () => {
    console.log("⏰ Running autoConfirmOrders...");
    await autoConfirmOrders();
  });
}
