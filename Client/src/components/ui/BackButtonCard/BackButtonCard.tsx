import BackButton, {
  type BackButtonProps,
} from "../Buttons/BackButton/BackButton";
import styles from "./BackButtonCard.module.css";

const BackButtonCard = ({ handleGoBack }: BackButtonProps) => {
  return (
    <div className={styles.container}>
      <BackButton handleGoBack={handleGoBack} />
    </div>
  );
};

export default BackButtonCard;
