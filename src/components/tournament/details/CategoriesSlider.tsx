import React, { useState } from 'react'
import { Category } from '../../../interfaces/interfaces';
import styles from '../../../assets/styles/tournamentDetails.module.css'


interface CategoriesProps {
    categories: Category[];
    categoryNum: number;
    setCategoryNum: (num: number) => void;
  }

const CategoriesSlider: React.FC<CategoriesProps> = ({ categories, categoryNum, setCategoryNum }) => {

    const changeCategory = (id: number) => {
        setCategoryNum(id);
    };

    return (
        <div className={styles.tableWrapper}>
            <style>{`
              .${styles.tableWrapper}::-webkit-scrollbar-thumb {
                border-radius: 5px;
              }
            `}</style>
            <table className={styles.scrollableTable}>
                <thead></thead>
                <tbody>
                    <tr>
                        {/* <td key={"categ-0"}>
                            <div
                                className={
                                    styles.categoryOption +
                                    (categoryNum === 0 ? ` ${styles.selectedCat}` : "")
                                }
                                onClick={() => changeCategory(0)}
                                style={{ color: '#fff' }}
                            >
                                Todo
                            </div>
                        </td> */}
                        {categories.map(
                            (cat) => (
                                <td key={"categ-" + cat.id}>
                                    <div
                                        className={
                                            styles.categoryOption +
                                            (categoryNum === cat.id
                                                ? ` ${styles.selectedCat}`
                                                : "")
                                        }
                                        onClick={() => changeCategory(cat.id)}
                                        style={{ color: '#fff' }}
                                    >
                                        {cat.value}
                                    </div>
                                </td>
                            )
                        )}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default CategoriesSlider;
