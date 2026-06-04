import styles from "./PostCaption.module.css";

type PostCaptionProps = {
  caption?: string;
};

const PostCaption = ({ caption }: PostCaptionProps) => {
  return (
    <h4 className={`${styles.caption} ${caption ?? styles.noCaption}`}>
      {caption || "بدون عنوان"}
    </h4>
  );
};

export default PostCaption;
