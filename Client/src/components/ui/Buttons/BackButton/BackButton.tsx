import SvgArrowLeft from "../../icons/SvgArrowLeft";
import styles from "./BackButton.module.css";

export type BackButtonProps = {
  handleGoBack: () => void;
};

const BackButton = ({ handleGoBack }: BackButtonProps) => {
  return (
    <button className={styles.btn} onClick={handleGoBack} aria-label="بازگشت">
      <SvgArrowLeft width={24} height={24} />
    </button>
  );
};

export default BackButton;
