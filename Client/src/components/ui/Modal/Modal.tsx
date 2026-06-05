import { type ReactNode } from "react";
import styles from "./Modal.module.css";
import { FaX } from "react-icons/fa6";

type ModalProps = {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: () => void;
};

const Modal = ({ children, title, onClose, isOpen, setIsOpen }: ModalProps) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? "" : `${styles.disabled}`}`}
        onClick={handleClose}
      ></div>
      <div
        className={`${styles.modal} ${isOpen ? "" : `${styles.disabled}`}`}
        role="dialog"
        aria-modal="true"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{title ?? ""}</h2>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={handleClose}
          >
            <FaX />
          </button>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </>
  );
};

export default Modal;
