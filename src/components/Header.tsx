import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsersCog } from "react-icons/fa";
import useWindowSize from "../hooks/useWindowSize";
import styles from "../assets/styles/header.module.css";
import imageLogo from "../assets/logoFsociety3.png";
import { useUserContext } from "../contexts/UserContext";
import { PagesNames } from "../utils/constants";
import { Container } from "@mui/material";
import profileImg from "../assets/nonProfile.png";
import onliveGif from "../assets/onlive.gif";
import twitchLogo from "../assets/twitch-removebg.png";
import { getEmptyAdminSettings } from "../utils/methods";
import { doc, getDoc } from "firebase/firestore";
import { CollectionNames } from "../utils/collectionNames";
import { db } from "../utils/firebase-config";
import { AdminSettingsInterface } from "../interfaces/interfaces";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const { user, isAdmin, userInfo } = useUserContext();
  const navigate = useNavigate();
  const [twitchStatus, _setTwitchStatus] = useState<
    "loading" | "online" | "offline"
  >("loading");
  const [adminSettings, setAdminSettings] = useState<AdminSettingsInterface>(
    getEmptyAdminSettings()
  );

  const scrollToTournaments = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    } else {
      const tournamentSection = document.getElementById("list-tournaments");
      if (tournamentSection) {
        tournamentSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const fetchBannerById = async () => {
      const adminSettingsRef = doc(db, CollectionNames.Admin, "admin");

      const docSnap = await getDoc(adminSettingsRef);

      if (docSnap.exists()) {
        setAdminSettings(docSnap.data() as AdminSettingsInterface);
      }
    };

    fetchBannerById();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [useWindowSize]);

  /* useEffect(() => {
    const getTwitchStatus = async () => {
      const username = "rubius";
      try {
        const response = await fetch(
          `https://api.twitch.tv/kraken/streams/${username}?callback=?`
        );
        const sourceCode = await response.text();

        if (sourceCode.includes("isLiveBroadcast")) {
          console.log(`${username} is live`);
        } else {
          console.log(`${username} is not live`);
        }
      } catch (error) {
        setTwitchStatus("offline");
      }
    };

    getTwitchStatus();
  }, []); */

  const onClickHeader = () => {
    setIsOpen(!isOpen);
  };

  const isResponsive = width <= 1268;
  const conditional = isOpen && isResponsive ? styles.navigationResponsive : "";

  return (
    <header>
      <Container>
        <div className={styles.headerContainer}>
          <div className={styles.logosHeader}>
            <div className={styles.logo_img}>
              <Link to="/">
                <div className={styles.logoHeader}>
                  <img
                    src={imageLogo}
                    alt="fsociety logo"
                    width={88}
                    height={88}
                  />
                </div>
              </Link>
            </div>
            <div className={styles.logo_img}>
              {adminSettings.twitchChannel !== "" && (
                <Link to={adminSettings.twitchChannel} target="_blank">
                  <div className={styles.logoHeader}>
                    <img
                      src={twitchStatus === "online" ? onliveGif : twitchLogo}
                      alt="twitch channel"
                    />
                  </div>
                </Link>
              )}
            </div>
          </div>
          <nav className={`${styles.navigation} ${conditional}`}>
            <div
              className={
                conditional !== styles.navigationResponsive
                  ? styles.navCont
                  : ""
              }
            >
              {isAdmin && (
                <>
                  <div className={styles.headerLink} onClick={onClickHeader}>
                    <FaUsersCog className={styles.iconHeader} />
                    <Link to={PagesNames.Admin}>
                      <span className={`${styles.link} ml-1`}>Admin Panel</span>
                    </Link>
                  </div>
                </>
              )}
              <div className={styles.headerLink} onClick={onClickHeader}>
                <Link to={PagesNames.TournamentRules}>
                  <span className={`${styles.link} ml-1`}>Reglamento</span>
                </Link>
              </div>
              <div className={styles.headerLink} onClick={onClickHeader}>
                <Link to={PagesNames.DisclosurePolicy}>
                  <span className={`${styles.link} ml-1`}>Info</span>
                </Link>
              </div>
              <div className={styles.headerLink} onClick={scrollToTournaments}>
                <span className={`${styles.link} ml-1`}>Torneo</span>
              </div>

              <div className={styles.headerLink} onClick={onClickHeader}>
                <Link to={user ? PagesNames.Profile : PagesNames.Auth}>
                  <img
                    src={user?.photoURL ?? profileImg}
                    alt="profile-img"
                    className={styles["header-profile-img"]}
                    width={40}
                    height={40}
                  />

                  <span className={`${styles.link} ${styles.mainButton} ml-1`}>
                    {user
                      ? userInfo
                        ? userInfo.nickname.split(" ")[0]
                        : ""
                      : "Iniciar Sesion"}
                  </span>
                </Link>
              </div>
            </div>
          </nav>
          <div className={styles.menuButton} onClick={onClickHeader}>
            <button
              className={
                isOpen && isResponsive
                  ? styles.cancelButtonHeader
                  : styles.headerButton
              }
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
