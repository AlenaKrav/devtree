//la parte de admin/profile que muestra el handl + foto

import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import NavigationTabs from "../components/NavigationTabs";
import type { SocialNetwork, User } from "../types";
import { useEffect, useState } from "react";
import DevTreeLink from "./DevTreeLink";
import { useQueryClient } from "@tanstack/react-query";

type DevTreeProps = {
  data: User;
};

export default function DevTree({ data }: DevTreeProps) {
  const userBdEnabledLinks: SocialNetwork[] = JSON.parse(data.links).filter(
    (item: SocialNetwork) => item.enabled);
  const [enabledLinks, setEnabledLinks] = useState(userBdEnabledLinks);

  useEffect(() => {
    setEnabledLinks(userBdEnabledLinks);
  }, [data]);


  const queryClient = useQueryClient();
 

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e; //active el elem que estamos arrastrando, over el que fue desplazado

    //comprobamos si existe
    if (over && over.id) {
      const prevIndex = enabledLinks.findIndex((link) => link.id === active.id);
      const newIndex = enabledLinks.findIndex((link) => link.id === over.id);
      const order = arrayMove(enabledLinks, prevIndex, newIndex)


    console.log("Previndex", prevIndex);
    console.log("newIndex", newIndex);
    console.log("Order", order)
    setEnabledLinks(order); //devuelve el mismo array pero ordenado
    console.log('Ordered enabled links', order)

    //obtenemos los links del bd del user que estan deshabilitados
    // porque si solo establecemos en el cache order, solo le mandaremos los que estan habilitados y en orden
    const userBdDisablesLinks : SocialNetwork[] = JSON.parse(data.links).filter(
    (item: SocialNetwork) => !item.enabled);

    const joinedLinks = [...order, ...userBdDisablesLinks]



     queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(joinedLinks)
      }
     })

    }


    //obtenemos el indice del elemento que queremos mover
    //buscamos entre los elementos activos el que coincide con el selececcionado
  };

  return (
    <>
      <header className="bg-slate-800 py-5">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
          <div className="w-full p-5 lg:p-0 md:w-1/3">
            <img src="/logo.svg" className="w-full block" />
          </div>
          <div className="md:w-1/3 md:flex md:justify-end">
            <button
              className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
              onClick={() => {}}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      <div className="bg-gray-100  min-h-screen py-10">
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <NavigationTabs />
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={"data.handle"}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visitar Mi Perfil: /{data.handle}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-4xl text-center text-white">{data.handle}</p>
              {data.image && (
                <img
                  src={data.image}
                  alt="Imagen Perfil"
                  className="mx-auto max-w-[250]"
                />
              )}
              <p className="text-lg text-center font-black text-white">
                {data.description}
              </p>

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="mt-20 flex flex-col gap-3">
                  <SortableContext
                    items={enabledLinks}
                    strategy={verticalListSortingStrategy}
                  >
                    {enabledLinks.map((link) => (
                      <DevTreeLink key={link.name} link={link} />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
