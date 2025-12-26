//Conecta a la base de datos
import mongoose from 'mongoose'
import colors from 'colors'

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.bgMagenta.bold(`MongoDB Conectado en ${url}`))
    } catch (error) {
        console.log(colors.bgRed.white.bold(error.message))
        //salimos de la conexion si hay un error
        process.exit(1)
    }
}