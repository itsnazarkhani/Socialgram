import styles from "./PostCaption.module.css";

type PostCaptionProps = {
  caption?: string;
  extraClassNames?: string;
};

const PostCaption = ({ caption, extraClassNames }: PostCaptionProps) => {
  return (
    <h4
      className={`${styles.caption} ${caption ?? styles.noCaption} ${extraClassNames}`}
    >
      {caption || "بدون عنوان"}
    </h4>
  );
};

export default PostCaption;
