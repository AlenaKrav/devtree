//Define rutas
//usa las funciones de handlers/index.ts
import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, login, updateProfile, uploadImage } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { autenticate } from './middleware/auth'

const router = Router()


//routing
router.get('/', (req, res) => {
    res.send('Hola mundo en express / Typescript')
})

//Registro
router.post('/auth/register', 
    //hacemos validacion aqui para no engrosar el controlador
    body('handle').notEmpty().withMessage("El handle no puede ir vacio"),
    body('name').notEmpty().withMessage("El nombre no puede ir vacio"),
    body('email').isEmail().withMessage("Email no válido"),
    body('password').isLength({min: 8}).withMessage("Password es muy corto"),
    handleInputErrors,
    createAccount
)

//Autenticacion
router.post('/auth/login',
    body('email').isEmail().withMessage("Email no válido"),
    body('password').notEmpty().withMessage("Password es obligatorio"),
    login
)
//para poder acceder a esa ruta se necesita autenticar al user
router.get('/user', autenticate, getUser)

// actualizacion de datos del user
router.patch('/user', 
    body('handle')
    .notEmpty()
    .withMessage("El handle no puede ir vacio"),
    body('description')
    .notEmpty()
    .withMessage("La descripción no puede ir vacia"),
    handleInputErrors,
    autenticate, 
    updateProfile)


router.post('/user/image', autenticate, uploadImage)


export default router