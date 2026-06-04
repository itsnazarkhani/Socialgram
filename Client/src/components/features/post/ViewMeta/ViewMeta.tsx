import styles from "./ViewMeta.module.css";
import { FaEye } from "react-icons/fa6";

type ViewMetaProps = {
  viewCount: number;
};

const ViewMeta = ({ viewCount }: ViewMetaProps) => {
  return (
    <div className={styles.container}>
      <span>{viewCount.toLocaleString("fa-IR")}</span>
      <FaEye />
    </div>
  );
};

export default ViewMeta;
