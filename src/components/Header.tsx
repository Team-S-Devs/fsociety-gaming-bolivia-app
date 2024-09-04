import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BiSolidUser } from "react-icons/bi";
import { GoFileDirectoryFill } from "react-icons/go";
import { FaStore, FaUsersCog } from "react-icons/fa";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, onSnapshot } from "firebase/firestore";
// import { auth, db } from "../utils/firebase-config";
import useWindowSize from "../hooks/useWindowSize";
import styles from "../assets/styles/header.module.css";
import imageLogo from "../assets/logoFsociety3.png";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const [user, setUser] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    console.log("vino acaaaaaa");
    setIsOpen(false);
  }, [useWindowSize]);

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (fireBaseUser) => {
  //       if (fireBaseUser) {
  //         setUser(fireBaseUser.uid);
  //         const userDocRef = doc(db, "users", fireBaseUser.uid);
  //         onSnapshot(userDocRef, (snapshot) => {
  //           const userData = snapshot.data();
  //           if (userData) {
  //             setFullname(userData.fullname);
  //             setIsAdmin(userData.admin);
  //           } else {
  //             setFullname("Perfil");
  //           }
  //         });
  //       } else {
  //         setUser(null);
  //         setFullname("Perfil");
  //       }
  //     });

  //     return () => unsubscribe();
  //   }, []);

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
              <img
                src={imageLogo}
                alt="fsociety logo"
                width={70}
                height={70}
              />
            </div>
          </Link>
        </div>
        <nav className={`${styles.navigation} ${conditional}`}>
          <div className={conditional !== styles.navigationResponsive ? styles.navCont : ""}>
            {isAdmin && (
              <>
                <div className={styles.headerLink}>
                  <FaUsersCog className={styles.iconHeader} />
                  <Link to="/admin">
                    <span className={`${styles.link} ml-1`}>Admin Panel</span>
                  </Link>
                </div>
              </>
            )}
            <div className={styles.headerLink}>
              <Link to="/tournaments">
                <span className={`${styles.link} ml-1`}>Torneos</span>
              </Link>
            </div>
            <div className={styles.headerLink}>
              <Link to="/teams">
                <span className={`${styles.link} ml-1`}>Equipos</span>
              </Link>
            </div>
            <div className={styles.headerLink}>
              <BiSolidUser className={styles.iconHeader} />
              <Link to={user ? "/profile" : "/auth"}>
                <span className={`${styles.link} ${styles.mainButton} ml-1`}>
                  {user ? fullname : "Iniciar Sesion"}
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className={styles.menuButton} onClick={onClickHeader}>
          <button
            className={isOpen && isResponsive ? styles.cancelButtonHeader : styles.headerButton}
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
