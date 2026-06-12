import {CorsOptions} from 'cors'


export const corsConfig: CorsOptions  = {
    origin: function (origin, callback) {

        const whiteList  = [process.env.FRONTEND_URL]
         //argv = argument vector
        if(process.argv[2] === '--api'){
            whiteList.push(undefined)
        }
       
        if(whiteList.includes(origin)){
            //error - null, true - permitimos la conexion
            callback(null, true)
        }
        else {
            callback (new Error('Error de CORS'))
        }
    }


}