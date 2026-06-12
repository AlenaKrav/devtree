import { useForm } from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { ProfileForm, User } from '../types'
import { updateProfile, uploadImage } from '../api/DevTreeAPI'
import { toast } from 'sonner'

export default function ProfileView() {

    const queryClient = useQueryClient()
    //accedemos a los datos cacheados del usequery, con ! decimos que esta garantizado que el user va a existir
    const data: User = queryClient.getQueryData(['user'])!

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
        //al cargar el formulario cargamos la info en los campos
        defaultValues: {
            handle: data.handle,
            description: data.description
        }
    })


    //actualizamos el perfil, se usa useMutation ya que en la api hacemos un patch y no lectura
    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            //si el perfil se actualizado correctamente
           toast.success(data)
           //empezamos modificando la url que muetsra el perfil
           //lo que hace es eliminar los datos cacheados
           //para que se vuelva a hcer la consulta
           queryClient.invalidateQueries({queryKey: ['user']})
        }
    })



    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            toast.error(error.message);

        },
        onSuccess: (data) => {
            // Optimistic update
            //setQueryData permite modificar los datos cacheados en getquerydata
            //se modifica el objeto en memoria
            queryClient.setQueryData(['user'], (prevData: User)=> {
                return {
                    //recuperamos lo cacheado
                    ...prevData,
                    //pero cambiamos la img por la que nos viene de la respuesta del server
                    image: data
                }

            })
        }
    })

    //No es necesario hacer el submit del formulario para que se actualice la foto, lo hace con ese evento onChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            uploadImageMutation.mutate(e.target.files[0])
        }
        
    };

    //para aprovechas la misma funcion de actulizacion de perfil y por tanto el mismo endpoint
    //originalmente desde aqui se enviaban los datos del formulario (handle + description)
    const handleUserProfileForm = (formData: ProfileForm) => {
        //obtenemos la info del user almacenado en el caché
        //aqui viene el objeto completo CACHEADO
        const user: User = queryClient.getQueryData(['user'])!;
        //obtenemos os valores actuales enviado en este momento desde el formulario 
        user.description = formData.description;
        user.handle = formData.handle;

        updateProfileMutation.mutate(user)
    }

    return (
        <form
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register('handle', {
                        required: "El nombre de user es obligatorio"
                    })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register('description', {
                        required: "La descripción es obligatoria"
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>
    )
}