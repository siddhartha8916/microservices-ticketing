import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.json({
    success: true,
    message: "Logged Out Successfully",
  });
});

export { router as signOutRouter };
