//aqui se van a mostrar los links
import { useEffect, useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";
import { linkIsValid } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";
import type { SocialNetwork, User } from "../types";

export default function LinkTreeView() {
  //lo que queremos modificar y la funcion para modificarlo
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(["user"])!;

  // como aqui solo vamos a tener 1 unica mutacion se extrae directamente la funcion, en otro sitio se referenciaba ademas por la nombreFuncion.mutate
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Enlace actualizado correctamente");
    },
  });
  //sincronizar la ui con lo cacheado de la bd o con el objeto links inicial
  //intersante añadir user como dependencia, para que cada vez que se actulice el user cacheado lo refleje
  useEffect(() => {
    const updatedData = devTreeLinks.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: SocialNetwork) => link.name === item.name,
      );

      if (userLink) {
        return { ...item, url: userLink.url, enabled: userLink.enabled };
      }
      return item;
    });

    setDevTreeLinks(updatedData);
  }, []);

  // Gestionar los cambios en los inputs de las RRSS
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //por cada objeto link del array, comprobamos si el nombre de dicho coincide con el nombre del campo en el que estamos escribiendo
    // si es asi cogemos dicho objeto link, lo copiamos pero solo escribiendo en su propiedad url
    // en caso contrario devolvemos el valor del link, que será un string vacío
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link,
    );
    setDevTreeLinks(updatedLinks);
  };

  //obtenemos los links del user cacheado (TODO EL OBJETO)
  const cachedLinks: SocialNetwork[] = JSON.parse(user.links);
  console.log("Links cacheados del user", cachedLinks);
  console.log("Numero de links cacheados", cachedLinks.length);

  // Gestionar activar/desactivar los links
  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      //recorremos los links del estado global
      if (link.name === socialNetwork) {
        //si el nombre del link del estado es el mismo del input - está pulsado
        if (linkIsValid(link.url)) {
          //validamos la url del estado (la que habia escrito el user)
          return { ...link, enabled: !link.enabled }; // copiamos el link y sobrescribimos su propiedad enables
        } else {
          toast.error("La url introducida no es válida");
        }
      }
      return link; //sino devolvemos el link sin cambios
    });
    //actualizamos el estado local (TODO EL ARRAY CON 8 OBJETOS)
    console.log('Actualizamos el estado con los links habilitados')
    setDevTreeLinks(updatedLinks);

    //creamos un array vacío que solo va a contener enlaces habilitados
    let udpatedItems: SocialNetwork[] = [];

    //buscamos dentro de los links del estado local la red social pulsada
    const selectedSocialNetwork = updatedLinks.find(
      (link) => link.name === socialNetwork
    );
    //si está habiliada, la añadimos al caché
    if (selectedSocialNetwork?.enabled) {
      //creamos una variable para id (aqui se supone que solo se queda con el numero de links habilitados(los que no lo están tiene el id = 0)
      // y le suma un 1
      const idNuevo = cachedLinks.filter(link => link.id > 0).length + 1
      //antes comprobamos si ya existe en el caché previamente, solo nos devovlera true o false
      if(cachedLinks.some(link => link.name === socialNetwork)) {
        //ahora tenemos que identificar cual es
        udpatedItems = cachedLinks.map(link => {
          if(link.name === socialNetwork){
            return {
              ...link,
              enabled: true,
              id: idNuevo
            }
          } else {
            return link;
          }
        })
      } else {
      const newItem = {
        ...selectedSocialNetwork,
        id: idNuevo
      };
      udpatedItems = [...cachedLinks, newItem]; //añadimos ese objeto al array de objetos habilitados
      }

    } else {
      // Si está deshabilitada, recorremos los links cacheados y nos quedamos con las rrss que no coincidan con el nombre = dame todos los links excepto el que acabo de desactivar
      // la eliminamos del caché
      // udpatedItems = cachedLinks.filter(link => link.name !== selectedSocialNetwork?.name)
      const indexToUpdate = cachedLinks.findIndex(
        (link) => link.name == selectedSocialNetwork?.name,
      ); //asi buscamos cual es el indice del link deshabilitado

      udpatedItems = cachedLinks.map((link) => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false,
          };
        } else if (link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1)) {
          return {
            ...link,
            id: link.id - 1,
          };
        } else {
          return link;
        }
      });
    }
    /** 
     * Tenemos 3 redes sociales activas:
     * Facebook -> id 1, posicion 0
     * Github -> id 2, posicion 1
     * IG -> id 3, posicion 2
     * 
     * Caso 1:
     * Desactivamos facebook (id original 1,posición dentro del array 0)
     * Su id se establece a 0
     * indexToUpdate = 0
     * link.id de github es 1, es mayor que 0 - si, le restamos un 1, id de github se pasa ser 1
     * link.id de Ig es 3, es mayor que 0 - si, le restamos un 1, id de IG pasa a ser 2
     * 
     * Caso 2:
     * desactivamos github (id original 2, posición dentro del array 1)
     * su id se establece a 0
     * indexToUpdate = 1
     * link.id de facebook es 1, es mayor que 1 - no, lo dejamos tal cual = 1
     * link.id de Ig es 3, es mayor que 1 - si, le restamos un 1, id de IG pasa a ser 2
    */


    // Almacenar el la BD
    //una vez tenemos estos datos actulizados seteamos con ellos el objeto de user cacheado
    queryClient.setQueryData(["user"], (prevData: User) => {
      return {
        ...prevData,
        //pasamos los links al string tal como lo requiere el modelo
        links: JSON.stringify(udpatedItems),
      };
    });
  };

  return (
    <>
      <div className="space-y-5">
        {devTreeLinks.map((item) => (
          <DevTreeInput
            key={item.name}
            //pasamos el item para poder renderizar la info de cada link
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
        <button
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
          onClick={() => mutate(queryClient.getQueryData(['user'])!)} //al no desmontarse realmente el componente forzamos la mutación del user del cache
        >
          Guardar cambios
        </button>
      </div>
    </>
  );
}
