//Crea la app
// Configura middlewares
// Carga routers
// Conecta a MongoDB
// Exporta la app

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'

connectDB()
//creamos una instancia del servidor
//un middleware global
const app = express();

//Cors
//middleware global
app.use(cors(corsConfig))


//leer datos del formulario, permitimos al servidor leer los datos json del body de las peticiones
app.use(express.json())
//esta es la ruta ppal
app.use('/', router)
export default app