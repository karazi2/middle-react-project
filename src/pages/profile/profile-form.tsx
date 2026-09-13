import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@hooks/store';
import { useUpdateUserMutation } from '@services/auth/api';
import { userSlice } from '@services/user/slice';
import { getApiErrorMessage } from '@utils/api';

import type { ChangeEvent, FormEvent, ReactElement } from 'react';

import styles from './profile-form.module.css';

export const ProfileForm = (): ReactElement => {
  const user = useAppSelector(userSlice.selectors.getUser);

  const [name, setName] = useState<string>(user?.name ?? '');

  const [email, setEmail] = useState<string>(user?.email ?? '');

  const [password, setPassword] = useState<string>('');

  const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
  }, [user]);

  const isChanged =
    name !== (user?.name ?? '') || email !== (user?.email ?? '') || password !== '';

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleCancel = (): void => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
  };

  const updateProfile = async (): Promise<void> => {
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    void updateProfile();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        value={name}
        icon="EditIcon"
        onChange={handleNameChange}
        extraClass="mb-6"
      />

      <EmailInput
        name="email"
        value={email}
        placeholder="Логин"
        isIcon
        onChange={handleEmailChange}
        extraClass="mb-6"
      />

      <PasswordInput
        name="password"
        value={password}
        icon="EditIcon"
        onChange={handlePasswordChange}
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
          {getApiErrorMessage(error, 'Не удалось сохранить изменения')}
        </p>
      )}
    </form>
  );
};
