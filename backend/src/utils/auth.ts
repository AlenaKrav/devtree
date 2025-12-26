import bcrypt from 'bcrypt'
export const hashPassword = async (password : string) => {
    //salt = cadena de caracteres aleatoria
    //hash unico para una misma cadena
    //ronda = 10 = numero de veces que se va a plicar la funcion de hash
    // > numero mas seguro, pero tmb mas recursos consumidos mas lento
    //10 - default
    const salt = await bcrypt.genSalt(10)
    //esperamos que la linea anterior acabe
    return await bcrypt.hash(password, salt)
}

export const checkPassword = async (enteredPassword: string, hash: string) => {
    return await bcrypt.compare(enteredPassword, hash)
}