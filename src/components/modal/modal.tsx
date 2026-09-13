import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import type { ReactNode, ReactPortal } from 'react';

import styles from './modal.module.css';

type ModalProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

const modalRoot = document.getElementById('modals');

export const Modal = ({ title, onClose, children }: ModalProps): ReactPortal | null => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return (): void => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />

      <div className={styles.modal}>
        <header className={styles.header}>
          {title && <h2 className="text text_type_main-large">{title}</h2>}

          <button
            className={styles.close}
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};
