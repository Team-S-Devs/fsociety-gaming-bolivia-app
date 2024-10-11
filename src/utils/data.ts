import slide1 from '../assets/bannerPremios.png';
import slide3 from '../assets/tournamentExample.png';

interface SliderItem {
  id: number;
  isBanner: boolean;
  dual: boolean;
  title: string;
  desc: string;
  cover: string;
}

export const SliderData: SliderItem[] = [
  {
    id: 1,
    isBanner: true,
    dual: false,
    title: "Inscribete al torneo",
    desc: "Participa en el torneo mas reciente y gana muchos premios",
    cover: slide1,
  },
  {
    id: 2,
    isBanner: true,
    dual: true,
    title: "Premios Unicos",
    desc: "Incribe a tu equipo que estas esperando",
    cover: slide3,
  },
];
