import { useParams } from "react-router-dom";
import styles from "./PostPage.module.css";
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import PostCard from "../../components/features/post/PostCard/PostCard";

const PostPage = () => {
  const { id }: { id?: string } = useParams();

  return (
    <PageContainer extraClassNames={styles.page}>
        <PostCard id={id} />
    </PageContainer>
  );
};

export default PostPage;
