//fichero entrutador que mostrará un fichero según la ruta visitada
//BrowserRouter prepara para utilizar react router dom
//Routes permite agrupar tdas la rutas
//Route compon donde definimos ruta y el componente a mostrar

/*
BrowserRouter
- Es el envoltorio principal del sistema de rutas.
- Le dice a React que vas a navegar usando URLs reales (/home, /login, /dashboard…).
- Usa la API de historial del navegador (pushState).

Routes
- Es un contenedor donde se colocan todas tus rutas.
- Evalúa la URL actual y decide qué componente mostrar.

Route
- Define una ruta concreta:
- Qué camino (path)
- Qué página o componente mostrar (element)
*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";
import HandleView from "./views/HandleView";
import NotFoundView from "./views/NotFoundView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/*con element decimos que este grupo de rutas usan esa plantilla */}
        <Route element={<AuthLayout />}>
          {/*aqui los hijos cada uno tiene su propia ruta */}
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
        </Route>
        {/* aqui los hijos compartiran el path del padre */}
        <Route path="/admin" element={<AppLayout />}>
          {/* la ruta que se muestra cuando entras al path del padre sin especificar nada más */}
          <Route index={true} element={<LinkTreeView />} />
          {/* ruta anidada para navegar a admin/profile, no se pone /antes 
                ya que significará una ruta absolutade la ruta ya que da error */}
          <Route path="profile" element={<ProfileView />} />
        </Route>
        <Route path="/:handle" element={<AuthLayout />}>
          <Route element={<HandleView />} index={true} />
        </Route>
        <Route path="/404" element={<AuthLayout />}>
        <Route element={<NotFoundView />} index={true} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
