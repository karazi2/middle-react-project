import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useLoginMutation } from '@services/auth/api';

import styles from '../auth/auth.module.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = (event) => {
    event.preventDefault();

    login({
      email,
      password,
    });
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>

        <EmailInput
          value={email}
          name="email"
          placeholder="E-mail"
          onChange={(event) => setEmail(event.target.value)}
          extraClass="mb-6"
        />

        <PasswordInput
          value={password}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Войти
        </Button>

        {isError && (
          <p className={`${styles.error} text text_type_main-default`}>
            {error?.data?.message || 'Не удалось выполнить вход'}
          </p>
        )}

        <div className={styles.links}>
          <p className={`${styles.text} text text_type_main-default`}>
            Вы — новый пользователь?{' '}
            <Link className={styles.link} to="/register">
              Зарегистрироваться
            </Link>
          </p>

          <p className={`${styles.text} text text_type_main-default`}>
            Забыли пароль?{' '}
            <Link className={styles.link} to="/forgot-password">
              Восстановить пароль
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
