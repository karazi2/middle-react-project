import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useLoginMutation } from '@services/auth/api';
import { getApiErrorMessage } from '@utils/api';

import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import styles from '../auth/auth.module.css';

export const LoginPage = (): ReactElement => {
  const [email, setEmail] = useState<string>('');

  const [password, setPassword] = useState<string>('');

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void login({
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
          onChange={handleEmailChange}
          extraClass="mb-6"
        />

        <PasswordInput
          value={password}
          name="password"
          onChange={handlePasswordChange}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Войти
        </Button>

        {isError && (
          <p className={`${styles.error} text text_type_main-default`}>
            {getApiErrorMessage(error, 'Не удалось выполнить вход')}
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
