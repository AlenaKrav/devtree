/*desde register view se seatean children como string por lo que si aqui children aparece como JSX.Element 
  saltará un error Type 'string | undefined' is not assignable to type 'Element'.
  Type 'undefined' is not assignable to type 'ReactElement<any, any>'*/
// export default function ErrorMessage({children} : {children: JSX.Element}) {

//tambien podemos crear una interfaz
// interface/type ErrorMessageProps = {
//   children: React.ReactNode
// }

// export default function ErrorMessage({children} : ErrorMessageProps) {
//   return (
//     <div>{children}</div>
//   )
// }


export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <p className="bg-red-50 text-red-600 p-3 text-sm font-bold text-center">{children}</p>
  )
}
