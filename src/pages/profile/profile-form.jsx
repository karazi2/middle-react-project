import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useUpdateUserMutation } from '@services/auth/api';
import { userSlice } from '@services/user/slice';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const user = useSelector(userSlice.selectors.getUser);

  const [name, setName] = useState(user?.name || '');

  const [email, setEmail] = useState(user?.email || '');

  const [password, setPassword] = useState('');

  const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
  }, [user]);

  const isChanged =
    name !== (user?.name || '') || email !== (user?.email || '') || password !== '';

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateUser({
        name,
        email,
        password,
      }).unwrap();

      setPassword('');
    } catch {
      // Ошибка отображается через RTK Query.
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        value={name}
        icon="EditIcon"
        onChange={(event) => setName(event.target.value)}
        extraClass="mb-6"
      />

      <EmailInput
        name="email"
        value={email}
        placeholder="Логин"
        isIcon
        onChange={(event) => setEmail(event.target.value)}
        extraClass="mb-6"
      />

      <PasswordInput
        name="password"
        value={password}
        icon="EditIcon"
        onChange={(event) => setPassword(event.target.value)}
        extraClass="mb-6"
      />

      {isChanged && (
        <div className={styles.actions}>
          <button
            className={`${styles.cancel} text text_type_main-default`}
            type="button"
            onClick={handleCancel}
          >
            Отмена
          </button>

          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      )}

      {isError && (
        <p className={`${styles.error} text text_type_main-default`}>
          {error?.data?.message || 'Не удалось сохранить изменения'}
        </p>
      )}
    </form>
  );
};
