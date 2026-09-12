import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useRegisterMutation } from '@services/auth/api';

import styles from '../auth/auth.module.css';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const handleSubmit = (event) => {
    event.preventDefault();

    register({
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
          onChange={(event) => setName(event.target.value)}
          extraClass="mb-6"
        />

        <EmailInput
          name="email"
          value={email}
          placeholder="E-mail"
          onChange={(event) => setEmail(event.target.value)}
          extraClass="mb-6"
        />

        <PasswordInput
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          extraClass="mb-6"
        />

        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          Зарегистрироваться
        </Button>

        {isError && (
          <p className={`${styles.error} text text_type_main-default`}>
            {error?.data?.message || 'Не удалось зарегистрироваться'}
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
