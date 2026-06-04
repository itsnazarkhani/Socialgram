import type React from "react";
import { useEffect, useState } from "react";
import type { PostListItemDto } from "../../dtos/postDtos";
import { postService } from "../../services/postService";
import type { PostsWithMediaBlob } from "../../interfaces/postInterfaces";
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import PostsGrid from "../../components/features/post/PostsGrid";

const ExplorePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostsWithMediaBlob[]>([]);

  useEffect(() => {
    const fetchPostsWithMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedPosts = await postService.getPosts();
        const postsWithMedia: PostsWithMediaBlob[] = await Promise.all(
          fetchedPosts.map(async (postListItem: PostListItemDto) => {
            try {
              const mediaBlob = await postService.getMedia(postListItem.id);
              return { ...postListItem, mediaBlob };
            } catch (mediaError) {
              console.error(
                `Error fetching media for post ${postListItem.id}:`,
                mediaError,
              );
              return { ...postListItem, mediaBlob: undefined };
            }
          }),
        );

        setPosts(postsWithMedia);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("خطا در بارگذاری پست‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchPostsWithMedia();
  }, []);

  if (loading) return <p className="loading-text">در حال بارگذاری پست‌ها...</p>;

  if (error) return <p className="error-text">{error}</p>;

  return (
    <PageContainer>
      {posts.length === 0 ? (
        <p className="empty-text">هنوز پستی برای نمایش وجود ندارد.</p>
      ) : (
        <PostsGrid posts={posts} />
      )}
    </PageContainer>
  );
};

export default ExplorePage;
