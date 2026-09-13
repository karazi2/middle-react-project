import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useForgotPasswordMutation } from '@services/auth/api';

import styles from '../auth/auth.module.css';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [forgotPassword, { isLoading, isError, error }] = useForgotPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await forgotPassword(email).unwrap();

      localStorage.setItem('passwordResetAllowed', 'true');

      navigate('/reset-password');
    } catch {
      // Ошибка отображается через RTK Query.
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <EmailInput
          name="email"
          value={email}
          placeholder="Укажите e-mail"
          onChange={(event) => setEmail(event.target.value)}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Восстановить
        </Button>

        {isError && (
          <p className={`${styles.error} text text_type_main-default`}>
            {error?.data?.message || 'Не удалось отправить письмо'}
          </p>
        )}

        <div className={styles.links}>
          <p className={`${styles.text} text text_type_main-default`}>
            Вспомнили пароль?{' '}
            <Link className={styles.link} to="/login">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
