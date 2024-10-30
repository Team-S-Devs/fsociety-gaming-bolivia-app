import React, { useEffect, useRef } from "react";
import styles from "../../../assets/styles/tournamentCard.module.css";
import rango1 from "../../../assets/ranges/rango1-min.png";
import rango2 from "../../../assets/ranges/rango2-min.png";
import rango3 from "../../../assets/ranges/rango3-min.png";
import rango4 from "../../../assets/ranges/rango4-min.png";
import rango5 from "../../../assets/ranges/rango5-min.png";
import rango6 from "../../../assets/ranges/rango6-min.png";
import rango7 from "../../../assets/ranges/rango7-min.png";
import rango8 from "../../../assets/ranges/rango8-min.png";
import rango9 from "../../../assets/ranges/rango9-min.png";
import rango10 from "../../../assets/ranges/rango10-min.png";
import { RangeUser } from "../../../interfaces/interfaces";

const ranges = [
  { label: RangeUser.WARRIOR, image: rango1 },
  { label: RangeUser.ELITE, image: rango2 },
  { label: RangeUser.MASTER, image: rango3 },
  { label: RangeUser.GRANDMASTER, image: rango4 },
  { label: RangeUser.EPIC, image: rango5 },
  { label: RangeUser.LEGEND, image: rango6 },
  { label: RangeUser.MYTHIC, image: rango7 },
  { label: RangeUser.GLORY_MYTHIC, image: rango8 },
  { label: RangeUser.MYTHIC_INMORTAL, image: rango9 },
  { label: RangeUser.MYTHIC_HONORED, image: rango10 },
];

interface CustomDropdownProps {
  selectedRange: RangeUser | null;
  setSelectedRange: React.Dispatch<React.SetStateAction<RangeUser | null>>;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  selectedRange,
  setSelectedRange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (range: RangeUser) => {
    setSelectedRange(range);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div
        className={styles.dropdownSelected}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ cursor: disabled ? "default" : "pointer" }}
      >
        {selectedRange ? (
          <div className={styles.dropdownOption}>
            <img
              src={ranges.find((r) => r.label === selectedRange)?.image}
              alt={selectedRange}
              className={styles.rangeImage}
            />
            <span>{selectedRange}</span>
          </div>
        ) : (
          <span>Escoge tu rango</span>
        )}
      </div>

      {!disabled && isOpen && (
        <div className={styles.dropdownOptions}>
          {ranges.map((range) => (
            <div
              key={range.label}
              className={styles.dropdownOption}
              onClick={() => handleSelect(range.label)}
            >
              <img
                src={range.image}
                alt={range.label}
                className={styles.rangeImage}
              />
              <span>{range.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
