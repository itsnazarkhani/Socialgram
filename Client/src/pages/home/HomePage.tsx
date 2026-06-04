import styles from "./HomePage.module.css"
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import PostCard from "../../components/features/post/PostCard/PostCard";
import type { PostListItemDto } from "../../dtos/postDtos";
import { useEffect, useState } from "react";
import { postService } from "../../services/postService";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [posts, setPosts] = useState<PostListItemDto[]>([]);

  useEffect(() => {
    setIsLoading(true);
    try {
      postService.getFollowingsPosts().then((response) => {
        setPosts(response);
      });
    } catch (err: any) {
      setError(err.tostring());
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <PageContainer extraClassNames={styles.page}>
      {isLoading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p>{error}</p>
      ) : posts.length === 0 ? (
        <p>هیچ پستی وجود ندارد.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} id={post.id} />)
      )}
    </PageContainer>
  );
}
