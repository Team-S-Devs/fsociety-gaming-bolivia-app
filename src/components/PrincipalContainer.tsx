import React, { ReactNode } from "react";
import urlImage from "../assets/backgroundSplash.jpg";
import styles from "../assets/styles/home.module.css";

interface PrincipalContainerProps {
  children: ReactNode;
}

const PrincipalContainer: React.FC<PrincipalContainerProps> = ({
  children,
}) => {
  return (
    <main className={styles.homeContainer}>
      <img src={urlImage} alt="banner app" className={styles.backgroundImage} />
      {children}
    </main>
  );
};

export default PrincipalContainer;
