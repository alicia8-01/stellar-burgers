import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '@ui';
import { TIngredient } from '@utils-types';

type RouteParams = {
  id?: string;
};

export const IngredientDetails: FC = () => {
  const { id } = useParams<RouteParams>();

  const ingredient = useSelector((state) => {
    const slice: any = (state as any).ingredients;

    const list: TIngredient[] =
      slice?.data || slice?.items || slice?.ingredients || [];

    if (!id) return null;

    return list.find((item) => item._id === id) ?? null;
  });

  return <IngredientDetailsUI ingredientData={ingredient} />;
};

export default IngredientDetails;
