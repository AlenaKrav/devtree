import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserByHandle } from "../api/DevTreeAPI";
import HandleData from "../components/HandleData";

export default function HandleView() {
  const params = useParams();
  const handle = params.handle!;
  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserByHandle(handle),
    queryKey: ["handle", handle], //añadimos una variable como dependencia para que cada vez que esta cambie se haga un refetch
  });

  if(isLoading){
    return <p className="text-center  text-white">Cargando...</p>
  }

  if(error){
    return <Navigate to={"/404"} />
  }

  console.log(data)

  if(data){
    return (
        <HandleData data={data} />
    )
  }
  
}
