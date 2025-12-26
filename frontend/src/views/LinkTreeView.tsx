//aqui se van a mostrar los links
import { useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";

export default function LinkTreeView() {
  //lo que queremos modificar y la funcion para modificarlo
  const [devTreeLinks, setDevTreeLinks] = useState(social);
  console.log(devTreeLinks);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    console.log(e.target.name);
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
          />
        ))}
      </div>
    </>
  );
}
