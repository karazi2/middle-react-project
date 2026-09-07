import styles from './modal-overlay.module.css';

export const ModalOverlay = ({ onClick }) => {
  return <div className={styles.overlay} onClick={onClick} />;
};
