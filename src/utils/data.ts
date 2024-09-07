import slide1 from '../assets/bannerPremios.png';
import slide2 from '../assets/backgroundSplash.jpg';
import slide3 from '../assets/tournamentExample.png';
import imageTour from '../assets/bannerFsociety.jpg';
import { Tournament } from '../interfaces/interfaces';
import { Timestamp } from 'firebase/firestore';

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

export const Tournaments: Tournament[] = [
  {
    id: "1",
    name: "Torneo MLBB",
    imagePath: imageTour,
    startDate: Timestamp.fromDate(new Date(2024, 3, 20)), 
    endDate: Timestamp.fromDate(new Date(2024, 4, 5)),
    teams: ["Team 1", "Team 2"],
    createdAt: Timestamp.now(),
  },
];