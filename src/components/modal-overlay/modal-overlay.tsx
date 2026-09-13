import type { MouseEventHandler, ReactElement } from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
};

export const ModalOverlay = ({ onClick }: ModalOverlayProps): ReactElement => {
  return <div className={styles.overlay} onClick={onClick} />;
};
