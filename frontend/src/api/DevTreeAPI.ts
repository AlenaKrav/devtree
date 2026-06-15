//fichero con las funciones que nos permitan comunicarnos con el back desde el fron
//aqui solo llamammos al servidor

import { isAxiosError } from "axios";
import api from "../config/axios";
import type { HandleUser, User } from "../types";

//obtenemos un token guardado para autenticar al user
export async function getUser() {
  try {
    //atributo data con la respuesta del backend
    const { data } = await api<User>("/user");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//actualizamos el perfil
export async function updateProfile(formData: User) {
  try {
    //atributo data con la respuesta del backend
    const { data } = await api.patch<string>("/user", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function uploadImage(file: File) {
  //instanciamos un objeto de formdata
  //formdata es una clase nativa del naveg que se usa para enviar datos multipart form-data
  let formData = new FormData();
  //agragamos el fichero al objeto creado anteriormente
  formData.append("file", file);

  try {
    //enviamos la peticion al endpoint + el objeto con el file agr
    //{ data: {image} }  --> extraemos el valor de image proveniente de response.data

    const {
      data: { image },
    }: { data: { image: string } } = await api.post("/user/image", formData);
    return image;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//obtenemos un token guardado para autenticar al user
export async function getUserByHandle(handle: string) {
  try {
    const { data } = await api.get<HandleUser>(`/${handle}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function searchByHandle(handle: string) {
  try {
    const { data } = await api.post<string>("/search", {handle});
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
