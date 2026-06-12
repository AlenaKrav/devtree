import type { HandleUser, SocialNetwork } from "../types";

type HandleDataProps = {
  data: HandleUser;
};

export default function HandleData({ data }: HandleDataProps) {
  const userEnabledLinks: SocialNetwork[] = JSON.parse(data.links).filter(
    (link: SocialNetwork) => link.enabled,
  );

  return (
    <div className="space-y-6 text-white">
      <p className="text-5xl text-center font-black">{data.handle}</p>
      {data.image && <img src={data.image} className="max-w-[250px] mx-auto" />}
      <p className="text-lg text-center font-black">{data.description}</p>
      <div className="mt-20 flex flex-col gap-6">
        {userEnabledLinks.length ? (
          userEnabledLinks.map((link) => (
            <a
              key={link.name}
              className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
            >
                <img src={`/social/icon_${link.name}.svg`} className="w-12 h-12 bg-cover"/>
              <p className="text-black font-bold text-lg">Visita mi: {link.name}</p>
            </a>
          ))
        ) : (
          <p className="text-center">
            Este usuario no tiene enlaces disponibles
          </p>
        )}
      </div>
    </div>
  );
}
