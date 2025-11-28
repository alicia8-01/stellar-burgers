import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ingredient-details.module.css';
import { IngredientDetailsUIProps } from './type';

export const IngredientDetailsUI: FC<IngredientDetailsUIProps> = ({
  ingredientData
}) => {
  const location = useLocation();
  const isModal = Boolean((location.state as any)?.background);
  const showTitleInBody = !isModal;

  if (!ingredientData) {
    return (
      <div className={styles.container}>
        {showTitleInBody && (
          <h2 className={`${styles.title} text text_type_main-large`}>
            Детали ингредиента
          </h2>
        )}
        <p className={styles.notFound}>Ингредиент не найден</p>
      </div>
    );
  }

  const { image_large, name, calories, proteins, fat, carbohydrates } =
    ingredientData;

  return (
    <div className={styles.content}>
      {showTitleInBody && (
        <h2 className='text text_type_main-large'>Детали ингредиента</h2>
      )}
      <img
        className={styles.img}
        alt='изображение ингредиента.'
        src={image_large}
      />
      <h3 className='text text_type_main-medium mt-2 mb-4'>{name}</h3>
      <ul className={`${styles.nutritional_values} text_type_main-default`}>
        <li className={styles.nutritional_value}>
          <p className={`text mb-2 ${styles.text}`}>Калории, ккал</p>
          <p className='text text_type_digits-default'>{calories}</p>
        </li>
        <li className={styles.nutritional_value}>
          <p className={`text mb-2 ${styles.text}`}>Белки, г</p>
          <p className='text text_type_digits-default'>{proteins}</p>
        </li>
        <li className={styles.nutritional_value}>
          <p className={`text mb-2 ${styles.text}`}>Жиры, г</p>
          <p className='text text_type_digits-default'>{fat}</p>
        </li>
        <li className={styles.nutritional_value}>
          <p className={`text mb-2 ${styles.text}`}>Углеводы, г</p>
          <p className='text text_type_digits-default'>{carbohydrates}</p>
        </li>
      </ul>
    </div>
  );
};

export default IngredientDetailsUI;
