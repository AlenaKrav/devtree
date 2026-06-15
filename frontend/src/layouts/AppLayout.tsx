import { Navigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";

export default function AppLayout() {
    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 2,
        //si cambiamos de pestaña/ventana que no lance más consultas
        refetchOnWindowFocus: false
    })

    if(isLoading) return <p className="text-center">Cargando...</p>
    if(isError) {
        return <Navigate to={'/auth/login'} />
    }

    if (data) return <DevTree data={data}/>
}