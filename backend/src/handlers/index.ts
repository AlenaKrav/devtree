//es como un controlador
//importamos para que request y response no sean de tipo any
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

//funciones que manejan las peticiones
export const createAccount = async (req: Request, res: Response) => {
  //sacamos el email y el password del body del reques
  const { email, password } = req.body;

  //comprobamos si este email ya existe en la BD
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("Un usuario con este email ya está registrado");
    //nos traemos el objeto de error key - value
    // con este return paramos la ejecucion del if
    return res.status(409).json({ error: error.message });
  }

  const handle = slug(req.body.handle, "");
  const handleExists = await User.findOne({ handle });

  if (handleExists) {
    const error = new Error("El handle ya está registrado");
    return res.status(409).json({ error: error.message });
  }

  //creamos un user con los parsametros que pasamos en el body del request
  const user = new User(req.body);
  //añadimos await ya que la funcion hashPassword es asincrona
  //seteamos las contraseña del user con la que acabamos de hashear
  user.password = await hashPassword(password);
  user.handle = handle;
  await user.save();
  // await User.create(req.body) -- es lo mismo
  //damos respuesta
  res.status(201).send("Usuario insertado correctamente");
  // res.json({msg: 'Usuario insertado correctamente'})
};

export const login = async (req: Request, res: Response) => {
  //Manejar errores
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //sacamos el email y el password del body del reques
  const { email, password } = req.body;

  //comprobamos si el email del user esta registrado
  const userLogueado = await User.findOne({ email });

  if (!userLogueado) {
    const error = new Error("Un usuario no está registrado");
    //nos traemos el objeto de error key - value
    // con este return paramos la ejecucion del if
    return res.status(404).json({ error: error.message });
  }

  //comprobar el password
  const isPasswordCorrect = await checkPassword(
    password,
    userLogueado.password,
  );
  if (!isPasswordCorrect) {
    const error = new Error("Password incorrecto");
    //nos traemos el objeto de error key - value
    // con este return paramos la ejecucion del if
    return res.status(401).json({ error: error.message });
  }

  const token = generateJWT({ id: userLogueado._id });

  res.send(token);
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;
    const handle = slug(req.body.handle, "");
    const handleExists = await User.findOne({ handle });

    if (handleExists && handleExists.email !== req.user.email) {
      const error = new Error("El handle ya está registrado");
      return res.status(409).json({ error: error.message });
    }

    // Actualizar el user
    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;
    await req.user.save();
    res.send("Perfil actualizado correctamente");
  } catch (e) {
    const error = new Error("Hubo un error");
    return res.status(500).json({ error: error.message });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  //solo permitimos la subida de un archivo
  const form = formidable({ multiples: false });

  try {
    //leemos los datos ingresado por el user: request - es lo que envia al server
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid() },
        async function (error, result) {
          if (error) {
            const error = new Error(
              "Se ha producido un error al subir la imagen",
            );
            return res.status(500).json({ error: error.message });
          }

          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();
            //devolvemos esa img
            res.json({ image: result.secure_url });
          }
        },
      );
    });
  } catch (e) {
    const error = new Error("Hubo un error");
    return res.status(500).json({ error: error.message });
  }
};

export const getUserByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params;
    // res.json({handle})
    const user = await User.findOne({ handle }).select(['description', 'image', 'links', 'handle', 'name']);
    if (user) {
      res.json(user);
    } else {
      return res.status(404).send("El user que buscas no existe");
    }
  } catch (e) {
    const error = new Error("Ha ocurrido un error");
    return res.status(500).json({ error: error.message });
  }
};


export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExists = await User.findOne({handle})
        if(userExists) {
            const error = new Error(`${handle} ya está registrado`)
            return res.status(409).json({error: error.message})
        }
        res.send(`${handle} está disponible`)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}
