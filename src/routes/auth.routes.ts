import express, { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/register", register);

router.post("/login", login);

// router.delete("/logout", function (req, res, next) {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         return next(err);
//       }
//       return res.redirect("localhost:3000");
//     });
//   }
// });

module.exports = router;
