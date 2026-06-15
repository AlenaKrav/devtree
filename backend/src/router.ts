//Define rutas
//usa las funciones de handlers/index.ts
import { Router } from "express";
import { body } from "express-validator";
import {
  createAccount,
  getUser,
  getUserByHandle,
  login,
  searchByHandle,
  updateProfile,
  uploadImage,
} from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { autenticate } from "./middleware/auth";

const router = Router();

//routing
router.get("/", (req, res) => {
  res.send("Hola mundo en express / Typescript");
});

router.get("/test", (req, res) => {
  res.send("Test");
});

//Registro
router.post(
  "/auth/register",
  //hacemos validacion aqui para no engrosar el controlador
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("email").isEmail().withMessage("Email no válido"),
  body("password").isLength({ min: 8 }).withMessage("Password es muy corto"),
  handleInputErrors,
  createAccount,
);

//Autenticacion
router.post(
  "/auth/login",
  body("email").isEmail().withMessage("Email no válido"),
  body("password").notEmpty().withMessage("Password es obligatorio"),
  login,
);
//para poder acceder a esa ruta se necesita autenticar al user
router.get("/user", autenticate, getUser);

// // actualizacion de datos del user
router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  handleInputErrors,
  autenticate,
  updateProfile,
);

router.post("/user/image", autenticate, uploadImage);


router.post("/search",
  body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
  handleInputErrors,
  searchByHandle
)

router.get("/:handle", getUserByHandle);

export default router;
