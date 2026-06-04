import { FcLike } from "react-icons/fc";
import styles from "./LikeButton.module.css";
import { FaRegHeart } from "react-icons/fa6";

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
      {isLiked ? <FcLike /> : <FaRegHeart />}
    </button>
  );
};

export default LikeButton;
