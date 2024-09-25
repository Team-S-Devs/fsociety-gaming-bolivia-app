import React, { useState } from "react";
import { Category } from "../../../interfaces/interfaces";
import styles from "../../../assets/styles/tournamentDetails.module.css";
import { Container } from "react-bootstrap";

interface CategoriesProps {
  categories: Category[];
  categoryNum: number;
  setCategoryNum: (num: number) => void;
}

const CategoriesSlider: React.FC<CategoriesProps> = ({
  categories,
  categoryNum,
  setCategoryNum,
}) => {
  const changeCategory = (id: number) => {
    setCategoryNum(id);
  };

  return (
    <Container>
      <div className={`${styles.tableWrapper}`}>
        <style>{`
                .${styles.tableWrapper}::-webkit-scrollbar-thumb {
                    border-radius: 5px;
                }
                `}</style>
        <table className={styles.scrollableTable}>
          <thead></thead>
          <tbody>
            <tr>
              {categories.map((cat) => (
                <td key={"categ-" + cat.id}>
                  <div
                    className={
                      styles.categoryOption +
                      (categoryNum === cat.id ? ` ${styles.selectedCat}` : "")
                    }
                    onClick={() => changeCategory(cat.id)}
                  >
                    {cat.value}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default CategoriesSlider;
