import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User,{ IUser } from '../models/User'

//extendemos la interfaz de request de express para que sea de tipo IUser
declare global{
    namespace Express {
        interface Request {
            //añadimos una nueva propiedad de tipo user
            user?: IUser
        }
    }
}

export const autenticate = async (req: Request, res: Response, next: NextFunction) => {
       const bearer = req.headers.authorization

   if(!bearer){
    const error = new Error('No autorizado')
    return res.status(401).json({error: error.message})
   }

   //como en response authorization nos trae Bearer token, solo nos quedamos con la parte del token
   //desestructura el array, pero saltándose el primer elemento
   //El primer elemento ("Bearer") se ignora porque la posición está vacía entre los corchetes.
   // el segundo elemento ("12345abcde") se guarda en la variable token.
   const [ , token] = bearer.split(' ')
   

   if(!token) {
    const error = new Error('No autorizado')
    return res.status(401).json({error: error.message})
   }
   //verificamos el token
   try {
    //verificamos token contra el secret
    const result = jwt.verify(token, process.env.JWT_SECRET)
    //el result que nos trae es un objeto con id, iat, exp
    //console.log(result)
    //si el resultado es un objeto y ademas tenemos el id
    if(typeof result === 'object' && result.id){
        //empezamos a buscar al user por es id
        //nos traemos todos los datos menos el passw
        const user = await User.findById(result.id).select('-password')
        if(!user){
            const error = new Error('El user no existe')
            return res.status(404).json({error: error.message})
        }
        req.user = user
        next()
    }
    
   } catch (error) {
    res.status(500).json({error: "Token no válido"})
   }

}