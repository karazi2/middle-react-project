import type { Ingredient, Order, OrderStatus } from '@/types';

export const calculateOrderPrice = (order: Order, ingredients: Ingredient[]): number => {
  return order.ingredients.reduce((total, ingredientId) => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);

    return total + (ingredient?.price ?? 0);
  }, 0);
};

export const getOrderIngredients = (
  order: Order,
  ingredients: Ingredient[]
): Ingredient[] => {
  return order.ingredients
    .map((ingredientId) => ingredients.find((item) => item._id === ingredientId))
    .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);
};

export const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'created':
      return 'Создан';

    case 'pending':
      return 'Готовится';

    case 'done':
      return 'Выполнен';
  }
};

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
