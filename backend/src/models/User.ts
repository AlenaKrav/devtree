import mongoose, { Schema, Document } from 'mongoose'
//typescript - usado en desarrollo, como debe ser un User, sus tipos
//IUser es para diferenciar entre el modelo y ek interface

export interface IUser extends Document {
    //nombre de user como en IG
    handle: string,
    name: string,
    email: string,
    password: string,
    description: string,
    image: string
}

//está en mongoose no typescritp
//1 primero definimos el modelo para User - usado en ejecucion
//define como un User se guardara en la BD, las reglas
//Interface y Schema deben ser un espejo el uno del otro
const userSchema = new Schema({
    "handle": {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },

    "name":{
        type: String,
        required: true,
        //permite eliminar los espacios en blanco al ppio
        trim: true 
    },
    "email": {
        type: String,
        required: true,
        //permite eliminar los espacios en blanco al ppio
        trim: true,
        unique: true,
        lowercase: true
    },
    "password": {
        type: String,
        required: true,
        //permite eliminar los espacios en blanco al ppio
        trim: true,
    },
    "description":{
        type: String,
        default: ''
    },

    "image":{
        type: String,
        default: ''
    }

})

//Creamos el modelo usando el esquema anterior
const User = mongoose.model<IUser>('User', userSchema)
export default User