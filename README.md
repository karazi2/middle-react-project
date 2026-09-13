## Sprint 4

Проект полностью переведён на TypeScript.

### Реализовано

- Все компоненты переведены с `.jsx` на `.tsx`.
- Хранилище, RTK Query API и утилиты переведены с `.js` на `.ts`.
- Добавлены общие типы для ингредиентов, пользователя, заказов и API.
- Типизированы Redux store, `RootState` и `AppDispatch`.
- Добавлены типизированные хуки `useAppDispatch` и `useAppSelector` через `withTypes`.
- Типизированы props, хуки, события, формы, React DnD и RTK Query.
- Убрано использование JavaScript-файлов в `src`.
- `allowJs` отключён.
- Не используются `as any` и `eslint-disable` для обхода типизации.
- После успешного заказа конструктор очищается.
- `BurgerIngredients` получает ингредиенты через RTK Query без передачи массива через props.

### Проверки

- `npx tsc -b` — успешно.
- `npm run eslint` — успешно.
- `npm run build` — успешно.
