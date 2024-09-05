import slide1 from '../assets/bannerFsociety.jpg';
import slide2 from '../assets/backgroundSplash.jpg';

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
    desc: "Participa en el torneo y gana millones",
    cover: slide1,
  },
  {
    id: 2,
    isBanner: true,
    dual: true,
    title: "Premios Unicos",
    desc: "Que estas esperando",
    cover: slide2,
  },
];
