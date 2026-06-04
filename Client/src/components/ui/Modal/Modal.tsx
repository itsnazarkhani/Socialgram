import { useEffect, useState, type ReactNode } from "react";
import styles from "./Modal.module.css";
import { FaX } from "react-icons/fa6";

type ModalProps = {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
};

const Modal = ({ children, title, onClose, isOpen }: ModalProps) => {
  const [keepOpen, setKeepOpen] = useState<boolean>(isOpen ?? false);

  useEffect(() => {
    if (isOpen) {
      setKeepOpen(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setKeepOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${keepOpen ? "" : `${styles.disabled}`}`}
        onClick={handleClose}
      ></div>
      <div
        className={`${styles.modal} ${keepOpen ? "" : `${styles.disabled}`}`}
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
