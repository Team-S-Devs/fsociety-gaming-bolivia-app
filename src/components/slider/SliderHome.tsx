import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from "@mui/material";
import SlideCard from "./SlideCard";
import { SliderData } from '../../utils/data';
import { SliderItem } from "../../interfaces/interfaces";
import styles from "../../assets/styles/sliderCard.module.css";

const SliderHome: React.FC = () => {
  const settings = {
    arrows: false,
    nav: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <section className={styles.homeSlide}>
      <Container>
        <Slider {...settings}>
          {SliderData.map((value: SliderItem, index: number) => {
            return (
              <SlideCard
                key={index}
                title={value.title}
                cover={value.cover}
                desc={value.desc}
              />
            );
          })}
        </Slider>
      </Container>
    </section>
  );
};

export default SliderHome;
