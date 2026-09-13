import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useRegisterMutation } from '@services/auth/api';
import { getApiErrorMessage } from '@utils/api';

import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import styles from '../auth/auth.module.css';

export const RegisterPage = (): ReactElement => {
  const [name, setName] = useState<string>('');

  const [email, setEmail] = useState<string>('');

  const [password, setPassword] = useState<string>('');

  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void register({
      name,
      email,
      password,
    });
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>

        <Input
          type="text"
          name="name"
          placeholder="Имя"
          value={name}
          onChange={handleNameChange}
          extraClass="mb-6"
        />

        <EmailInput
          name="email"
          value={email}
          placeholder="E-mail"
          onChange={handleEmailChange}
          extraClass="mb-6"
        />

        <PasswordInput
          name="password"
          value={password}
          onChange={handlePasswordChange}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Зарегистрироваться
        </Button>

        {isError && (
          <p className={`${styles.error} text text_type_main-default`}>
            {getApiErrorMessage(error, 'Не удалось зарегистрироваться')}
          </p>
        )}

        <div className={styles.links}>
          <p className={`${styles.text} text text_type_main-default`}>
            Уже зарегистрированы?{' '}
            <Link className={styles.link} to="/login">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
