import React from 'react';
import styles from '../../assets/styles/component.module.css';

interface ItemInfoTextProps {
  text: string;
  icon?: React.ReactNode;
  backColor?: string;
  textColor?: string;
}

const ItemInfoText: React.FC<ItemInfoTextProps> = ({ text, icon, backColor, textColor }) => {
  return (
    <div className={styles.infoItemContainer} style={backColor ? {backgroundColor: backColor} : {}}>
      {icon && <span className={styles.iconInfoItem} style={textColor ? {color: textColor}: {}}>{icon}</span>}
      <span style={textColor ? {color: textColor}: {}}>{text}</span>
    </div>
  );
};

export default ItemInfoText;
