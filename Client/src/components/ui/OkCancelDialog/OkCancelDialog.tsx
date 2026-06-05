import type { ReactNode } from "react";
import styles from "./OkCancelDialog.module.css";

type OkCancelDialogProps = {
  children?: ReactNode;
  onOk: () => void;
  onCancel: () => void;
};

const OkCancelDialog = ({ children, onOk, onCancel }: OkCancelDialogProps) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <p>{children}</p>
      </main>
      <footer>
        <button className={styles.cancelBtn} onClick={onCancel}>
          انصراف
        </button>
        <button className={styles.okBtn} onClick={onOk}>
          باشه
        </button>
      </footer>
    </div>
  );
};

export default OkCancelDialog;
