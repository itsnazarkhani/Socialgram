import LikeButton from "../../../ui/Buttons/LikeButton/LikeButton";
import styles from "./LikeMeta.module.css";

type LikeMetaProps = {
  isLiked: boolean;
  handleLikeToggle: () => void;
  onLikeCountClick?: () => void;
  likeCount: number;
};

const LikeMeta = ({
  isLiked,
  likeCount,
  handleLikeToggle,
  onLikeCountClick,
}: LikeMetaProps) => {
  return (
    <div className={styles.container}>
      <LikeButton isLiked={isLiked} onClick={handleLikeToggle} />
      <p className={styles.likeCount} onClick={onLikeCountClick}>
        {likeCount.toLocaleString("fa-IR")} پسند
      </p>
    </div>
  );
};

export default LikeMeta;
