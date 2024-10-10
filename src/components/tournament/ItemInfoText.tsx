import React from "react";
import styles from "../../assets/styles/component.module.css";

interface ItemInfoTextProps {
  text: string;
  icon?: React.ReactNode;
  backColor?: string;
  textColor?: string;
  onClick?: () => void; // Añadimos la propiedad onClick opcional
}

const ItemInfoText: React.FC<ItemInfoTextProps> = ({
  text,
  icon,
  backColor,
  textColor,
  onClick,
}) => {
  return (
    <div
      className={styles.infoItemContainer}
      style={{
        backgroundColor: backColor || "",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      {icon && (
        <span
          className={styles.iconInfoItem}
          style={textColor ? { color: textColor } : {}}
        >
          {icon}
        </span>
      )}
      <span style={textColor ? { color: textColor } : {}}>{text}</span>
    </div>
  );
};

export default ItemInfoText;
