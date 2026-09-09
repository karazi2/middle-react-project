import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

export const OrderDetails = ({ orderNumber }) => {
  return (
    <div className={styles.details}>
      <p className={`${styles.number} text text_type_digits-large`}>{orderNumber}</p>

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
