import { forwardRef, useMemo } from 'react';
import { IngredientsCategoryUI } from '@ui';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector((state) => state.constructorBurger);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    if (!burgerConstructor) return counters;

    const { bun, ingredients: constructorIngredients } = burgerConstructor;

    constructorIngredients.forEach((item) => {
      counters[item._id] = (counters[item._id] || 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
