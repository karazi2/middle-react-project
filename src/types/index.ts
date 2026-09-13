export type IngredientType = 'bun' | 'main' | 'sauce';

export type Ingredient = {
  _id: string;
  name: string;
  type: IngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
};

export type ConstructorIngredient = Ingredient & {
  key: string;
};

export type User = {
  name: string;
  email: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  password?: string;
};

export type ResetPasswordRequest = {
  password: string;
  token: string;
};

export type TokenData = {
  accessToken?: string;
  refreshToken?: string;
};

export type AuthResponse = {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type ApiMessageResponse = {
  success: boolean;
  message?: string;
};

export type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

export type CreateOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type MoveIngredientPayload = {
  dragIndex: number;
  hoverIndex: number;
};
