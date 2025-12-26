import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Router from './router'
import './index.css'

//instancia principal (el “cerebro”) de React Query.
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  //No es visible, solo chequea errores
  <React.StrictMode>
    {/*Provider de React Query (no visible) */}
    <QueryClientProvider client = {queryClient}>
      {/* Controla las rutas (no visible por sí mismo) */}
      <Router />
      {/*  Panel flotante de depuración */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
)
