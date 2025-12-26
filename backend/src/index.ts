//desde aqui arrancamos el servidor

//orden de importancion
//1 - dependencias
//2 - archivos
import colors from 'colors'
import server from './server'

//como en el deployemnt no sabremos que  puerto se nos va a asignar usamos
//cogemos las variables de entorno
//usa la variable de entorno si esta existe o sino usa el puerto 4000
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(colors.bgYellow.bold(`Servidor funcionando en el puerto: ${port}`))
})
