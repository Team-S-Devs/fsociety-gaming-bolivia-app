import React from 'react';
import styles from '../../../assets/styles/component.module.css';

interface InfoContainerStyledProps {
  leftText: string;
  rightText: string;
  icon?: React.ReactNode;
  backColor?: string;
  textColor?: string;
}

const InfoContainerStyled: React.FC<InfoContainerStyledProps> = ({ leftText, rightText, icon, backColor, textColor }) => {
  return (
    <div className={styles.itemDetailsContainer} style={backColor ? {backgroundColor: backColor} : {}}>
      {icon && <span className={styles.iconInfoItem} style={textColor ? {color: textColor}: {}}>{icon}</span>}
      <div className={styles.textContainerDetails}>
        <span id='leftText' style={textColor ? {color: textColor}: {}}>{leftText}</span>
        <span id='rightText' style={{color: '#fff'}}>{rightText}</span>
      </div>
    </div>
  );
};

export default InfoContainerStyled;
