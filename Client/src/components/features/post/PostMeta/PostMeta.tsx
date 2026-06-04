import styles from "./PostMeta.module.css";
import { FaEye } from "react-icons/fa6";

type PostMetaProps = {
  viewCount: number;
};

const PostMeta = ({ viewCount }: PostMetaProps) => {
  return (
    <div className={styles.container}>
      <span>{viewCount.toLocaleString("fa-IR")}</span>
      <FaEye />
    </div>
  );
};

export default PostMeta;
