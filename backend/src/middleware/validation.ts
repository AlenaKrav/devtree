import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    //Manejar errores
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    //procedemos a con la siguiente funcion, si no lo ponemos simepre entrara en middleware y se quedara cargando
    next()
}