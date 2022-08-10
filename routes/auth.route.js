//express tiene un middleware especializado para trabajar con rutas
import{ Router } from "express";
import { infoUser, login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { myValidationResult } from "../middlewares/myValidationResult.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = Router();

router.post("/login",[
  body("email", "Email ingresado no valido")
  .trim()
  .isEmail(),
  body("password", "Formato de email incorrecto")
  .trim(),
],
myValidationResult,
login);

router.post(
  "/register",
  [
    body("email", "Email ingresado no valido")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Password ingresado no valido")
    .trim()
    .isLength({min: 6})
    .withMessage('must be at least 6 chars long')
    .custom((value, {req}) =>{
      if(value !== req.body.repassword){
        throw new Error('No coinciden las contraseñas')
      }
      return value;
    })
    .withMessage('must be at leasong')

  ],
  myValidationResult,
  register
);

router.get('/protected', requireToken, infoUser)

router.get('/refresh', refreshToken)

router.get('/logout', logout)

export default router;
