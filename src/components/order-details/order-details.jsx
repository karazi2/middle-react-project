import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

const ORDER_NUMBER = '034536';

export const OrderDetails = () => {
  return (
    <div className={styles.details}>
      <p className={`${styles.number} text text_type_digits-large`}>{ORDER_NUMBER}</p>

      <p className="text text_type_main-medium mt-8">идентификатор заказа</p>

      <div className={`${styles.icon} mt-15 mb-15`}>
        <CheckMarkIcon type="primary" />
      </div>

      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>

      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
