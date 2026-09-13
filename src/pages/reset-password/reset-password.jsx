import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useResetPasswordMutation } from '@services/auth/api';

import styles from '../auth/auth.module.css';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [isResetAllowed] = useState(
    () => localStorage.getItem('passwordResetAllowed') === 'true'
  );

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const [resetPassword, { isLoading, isError, error }] = useResetPasswordMutation();

  if (!isResetAllowed) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await resetPassword({
        password,
        token,
      }).unwrap();

      localStorage.removeItem('passwordResetAllowed');

      navigate('/login', {
        replace: true,
      });
    } catch {
      // Ошибка отображается через RTK Query.
    }
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <PasswordInput
          name="password"
          value={password}
          placeholder="Введите новый пароль"
          onChange={(event) => setPassword(event.target.value)}
          extraClass="mb-6"
        />

        <Input
          type="text"
          name="token"
          value={token}
          placeholder="Введите код из письма"
          onChange={(event) => setToken(event.target.value)}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Сохранить
        </Button>

        {isError && (
          <p className={`${styles.error} text text_type_main-default`}>
            {error?.data?.message || 'Не удалось изменить пароль'}
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
