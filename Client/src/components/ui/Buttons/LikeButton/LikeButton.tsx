import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import styles from "./LikeButton.module.css";

type LikeButtonProps = {
  isLiked: boolean;
  extraClassNames?: string;
  onClick: () => void;
};

const LikeButton = ({ isLiked, extraClassNames, onClick }: LikeButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.btn} ${extraClassNames}`}
      onClick={onClick}
      aria-pressed={isLiked}
    >
      {isLiked ? <FcLike /> : <FcLikePlaceholder />}
    </button>
  );
};

export default LikeButton;
