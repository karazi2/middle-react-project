import { API_URL } from '@utils/constants';

const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }

  return Promise.reject(new Error(`Ошибка: ${response.status}`));
};

export const getIngredients = () => {
  return fetch(`${API_URL}/api/ingredients`)
    .then(checkResponse)
    .then((response) => response.data);
};
