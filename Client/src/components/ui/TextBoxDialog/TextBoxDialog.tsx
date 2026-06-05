import styles from "./TextBoxDialog.module.css";

type TextBoxDialogProps = {
  caption?: string;
  setCaption: (caption: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const TextBoxDialog = ({
  caption,
  setCaption,
  onSubmit,
  onCancel,
}: TextBoxDialogProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <textarea
          placeholder="توضیحات"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      <footer>
        <button className={styles.cancelBtn} onClick={onCancel}>
          انصراف
        </button>
        <button className={styles.submitBtn} onClick={onSubmit}>
          اعمال تغییرات
        </button>
      </footer>
    </div>
  );
};

export default TextBoxDialog;
