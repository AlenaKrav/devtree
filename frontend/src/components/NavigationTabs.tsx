import { BookmarkSquareIcon, UserIcon } from '@heroicons/react/20/solid'
import { Link, useLocation, useNavigate } from 'react-router-dom'

//array con las pestañas
const tabs = [
    { name: 'Links', href: '/admin', icon: BookmarkSquareIcon },
    { name: 'Mi Perfil', href: '/admin/profile', icon: UserIcon },
]
//recibe como parametro cualquier cantidad de strings
//esto se guardan en un array classes
//filter(Boolean)- elimina valores "falsy": string vacio, false, undefined, 0
//join - convierte el array en un string separando con espacio cada clase
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function NavigationTabs() {
    //sirve para conocer la pestaña activa
    const location = useLocation()

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(e.target.value)
    }

    return (
        <div className='mb-5'>
            {/* solo se muetsra en lo moviles */}
            <div className="sm:hidden">
                {/* htmlFor="tabs" → asocia el label al <select id="tabs"> */}
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    onChange={ (handleChange) }
                >
                    {/* recorre el arrya tabs y crea un elemento option por cada uno de los elementos usando dentro
                    del value y key clave valor de cada elemento del arrya */}
                    {tabs.map((tab) => (
                // Cada opción tiene un value={tab.href}
                // Cuando el usuario selecciona una opción:
                // handleChange recibe el evento
                // Extrae e.target.value → la ruta seleccionada
                // Llama a navigate(...) → cambia la URL
                        <option 
                            value={tab.href}
                            key={tab.name}
                        >{tab.name}</option>
                    ))}
                </select>
            </div>

            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {/* reccorr el array tabs
                        y crea un elemento Link pot cada uno de los elementos
                        como cla */}
                        {tabs.map((tab) => (
                            <Link
                                key={tab.name}
                                to={tab.href}
                                // si la ruta actual coincide es igual que la ruta que representa esta pestaña
                                //si las rutas coinciden = pestaña actual
                                //se enciende en azul, y sino se queda en gris
                                className={classNames(
                                    location.pathname === tab.href
                                        ? 'border-blue-500 text-blue-500'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'group inline-flex items-center border-b-2 py-4 px-1 text-xl'
                                )}
                            >
                                {/* lo mismo pasa con el icono */}
                                <tab.icon
                                    className={classNames(
                                        location.pathname === tab.href ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                                        '-ml-0.5 mr-2 h-5 w-5'
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}