//se basa en el interfaz del user del modelo
//aqui no indica el password ya que una vez logueado el user, no queremos mostrar su password en la app por seguridad
export type User = {
    handle: string,
    name: string,
    email: string,
    _id: string,
    description: string,
    image: string
}

//en este tipo solo seleccionamos algunos atributos de la interfaz anterior
//aqui añadimos password ya que son datos que usan durante el registro
export type RegisterForm = Pick<User, 'handle' | 'name' | 'email'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick <User, 'email'> & {
    password: string
}

export type ProfileForm = Pick <User, 'handle' | 'description'>

//creamos un tipo para los links sociales
//type ppal para la bbdd
export type SocialNetwork = {
    id: number;
    name: string;
    url: string;
    enabled: boolean;
}

//tipo para los links sociales que usaremos en el frontend
export type DevTreeLink = Pick <SocialNetwork, 'name' | 'url' | 'enabled'>