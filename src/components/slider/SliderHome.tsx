import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container } from "@mui/material";
import SlideCard from "./SliderImage";
import { Banner } from "../../interfaces/interfaces";
import { db } from "../../utils/firebase-config";
import { CollectionNames } from "../../utils/collectionNames";
import { getDocs, collection, query, where } from "firebase/firestore";
import styles from "../../assets/styles/sliderCard.module.css";
import Loader from "../../components/Loader";

const SliderHome: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const bannersQuery = query(
          collection(db, CollectionNames.Banners),
          where("active", "==", true),
          where("deleted", "==", false)
        );
        
        const querySnapshot = await getDocs(bannersQuery);
        const bannerList: Banner[] = querySnapshot.docs.map((doc) => doc.data() as Banner);
        setBanners(bannerList);
      } catch (error) {
        alert("Error obteniendo Banners, recarga la página.");
      }
      setLoading(false);
    };

    fetchBanners();
  }, []);

  const settings = {
    arrows: false,
    nav: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    adaptiveHeight: true,
  };

  const handleBannerClick = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className={styles.homeSlide}>
      <Container>
        <Slider {...settings}>
          {banners.map((banner: Banner, index: number) => (
            <div key={index} onClick={() => handleBannerClick(banner.redirectUrl)}>
              <SlideCard title="bannerCard" cover={banner.image.url} />
            </div>
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default SliderHome;
