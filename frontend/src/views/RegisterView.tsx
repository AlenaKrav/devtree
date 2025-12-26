import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {isAxiosError} from 'axios'
import { toast } from 'sonner'
import type {RegisterForm} from '../types'
import ErrorMessage from '../components/ErrorMessage'
import api from '../config/axios'

export default function RegisterView() {
    
    {/*aqui seteamos como valores iniciales de los campos como cadena vacia*/ }
    const initialValues : RegisterForm = {
        name: '',
        email: '',
        handle: '',
        password: '',
        password_confirmation: ''
    }
    {/*por lo que los errores nos van a venir en forma de cadena o undefined (al ppio cuando carguemos el formulario*/ }
    const { register, watch, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    //escuchamos el campo de password con cada keydown
    const passwordIntroducido = watch('password')
    // console.log(passwordIntroducido)
    //esta funcion lanzaba el console log cuando ya rellenabamos todos los campos correctamente
    //basicamos los datos que enviamos desde el formulario
    const handleRegister = async (formData: RegisterForm) => {
        try {
            //atributo data con la respuesta del backend
            const {data} = await api.post(`auth/register`, formData)
            toast.success(data)
            reset()
            
        } catch (error) {
            if(isAxiosError(error) && error.response){
                toast.error(error.response.data.error)
            }
        }
    }


    return (
        <>
            <h1 className='text-4xl text-white font-bold'>Crear cuenta</h1>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Tu Nombre"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('name', {
                            required: "Tu nombre es obligatorio"
                        })}
                    />
                    {/*si existe un error relac con el nombre renderiza es error dentro del componete, sino no muestres nada
                ya que ya tenemos valores inciales de tipo string que errors.name.message tambien será un string o undefined

                */}
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}



                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('email', {
                            required: "Tu email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder="Nombre de usuario: sin espacios"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('handle', {
                            required: "Tu handle es obligatorio"
                        })}
                    />
                    {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password', {
                            required: "Tu password es obligatorio",
                            minLength: {
                                value: 8,
                                message: "El password debe ser minimo 8 caracteres"
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Repetir Password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password_confirmation', {
                            required: "Debes repetir la contraseña",
                            validate: (value) => value === passwordIntroducido || 'Las contraseñas no coinciden'
                        })}
                    />
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    value='Crear Cuenta'
                />
            </form>


            <nav className='mt-10'>
                <Link
                    className='text-center text-white text-lg block'
                    to="/auth/login">
                    ¿Ya tienes una cuenta? Inicia tu sesión
                </Link>

            </nav>

        </>
    )
}
