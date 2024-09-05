import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BiSolidUser } from "react-icons/bi";
import { FaUsersCog } from "react-icons/fa";
import useWindowSize from "../hooks/useWindowSize";
import styles from "../assets/styles/header.module.css";
import imageLogo from "../assets/logoFsociety3.png";
import { useUserContext } from "../contexts/UserContext";
import { PagesNames } from "../utils/constants";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const { user, isAdmin, userInfo } = useUserContext();

  useEffect(() => {
    setIsOpen(false);
  }, [useWindowSize]);

  const onClickHeader = () => {
    setIsOpen(!isOpen);
  };

  const isResponsive = width <= 1268;
  const conditional = isOpen && isResponsive ? styles.navigationResponsive : "";

  return (
    <header>
      <div className={`${styles.headerContainer} container-general`}>
        <div className={styles.logo_img}>
          <Link to="/">
            <div className={styles.logoHeader}>
              <img src={imageLogo} alt="fsociety logo" width={70} height={70} />
            </div>
          </Link>
        </div>
        <nav className={`${styles.navigation} ${conditional}`}>
          <div
            className={
              conditional !== styles.navigationResponsive ? styles.navCont : ""
            }
          >
            {isAdmin && (
              <>
                <div className={styles.headerLink}>
                  <FaUsersCog className={styles.iconHeader} />
                  <Link to={PagesNames.Admin}>
                    <span className={`${styles.link} ml-1`}>Admin Panel</span>
                  </Link>
                </div>
              </>
            )}
            <div className={styles.headerLink}>
              <Link to={PagesNames.Tournments}>
                <span className={`${styles.link} ml-1`}>Torneos</span>
              </Link>
            </div>
            <div className={styles.headerLink}>
              <Link to={PagesNames.Teams}>
                <span className={`${styles.link} ml-1`}>Equipos</span>
              </Link>
            </div>
            <div className={styles.headerLink}>
              <BiSolidUser className={styles.iconHeader} />
              <Link to={user ? PagesNames.Profile : PagesNames.Auth}>
                <span className={`${styles.link} ${styles.mainButton} ml-1`}>
                  {user
                    ? userInfo
                      ? userInfo.name.split(" ")[0]
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
    </header>
  );
};

export default Header;
