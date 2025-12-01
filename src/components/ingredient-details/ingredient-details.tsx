import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { RootState, useSelector } from '../../services/store';
import { IngredientDetailsUI } from '@ui';
import { TIngredient } from '@utils-types';

type RouteParams = {
  id?: string;
};

export const IngredientDetails: FC = () => {
  const { id } = useParams<RouteParams>();

  const ingredient = useSelector((state: RootState): TIngredient | null => {
    if (!id) {
      return null;
    }

    const { items } = state.ingredients;

    return items.find((item) => item._id === id) ?? null;
  });

  return <IngredientDetailsUI ingredientData={ingredient} />;
};

export default IngredientDetails;
