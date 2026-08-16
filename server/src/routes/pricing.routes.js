import { Router } from "express";
const router = Router();

router.get("/", (_, res) => {
  res.json({
    currency: "INR",
    scooter: { unlockFee: 10, perMinute: 2 },
    ebike: { unlockFee: 15, perMinute: 3 },
    bike: { unlockFee: 5, perMinute: 1.5 },
    car: { unlockFee: 50, perMinute: 12 }
  });
});

export default router;
