import { useEffect, useRef, useState } from "react";
import type { PostDto } from "../../dtos/postDtos";
import { postService } from "../../services/postService";
import { userService } from "../../services/userService";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import type {
  PostWithDisplayData,
  PostCounters,
} from "../../interfaces/postInterfaces";
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import PostCard from "../../components/features/post/PostCard";

export default function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostWithDisplayData[]>([]);
  const [postCounters, setPostCounters] = useState<PostCounters>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const postRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const viewedPostIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchPostsAndMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPosts: PostDto[] = await postService.getFollowingsPosts();

        const initialCounters: PostCounters = {};
        const postsWithMediaPromises = fetchedPosts.map(
          async (post: PostDto) => {
            let mediaBlob: Blob | undefined = undefined;
            let avatarBlob: Blob | undefined = undefined;

            try {
              mediaBlob = await postService.getMedia(post.id);
            } catch (mediaError) {
              console.error(
                `Error fetching media for post ${post.id}:`,
                mediaError,
              );
            }

            if (post.postOwnerId) {
              try {
                avatarBlob = await userService.getAvatar(post.postOwnerId);
              } catch (avatarError: any) {
                if (avatarError?.response?.status == 404)
                  avatarBlob = undefined;
                else throw avatarError;
              }
            }

            initialCounters[post.id] = {
              viewCount: post.viewCount ?? 0,
              likeCount: post.likeCount ?? 0,
            };
            setLikedMap((prev) => ({ ...prev, [post.id]: post.didYouLiked }));
            return { ...post, mediaBlob, avatarBlob };
          },
        );

        const postsData = await Promise.all(postsWithMediaPromises);
        setPosts(postsData);
        setPostCounters(initialCounters);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError("خطا در بارگذاری پست‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndMedia();
  }, []);

  useEffect(() => {
    const currentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute("data-id");
            if (postId) {
              incrementViewCount(postId);
              currentObserver.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    Object.values(postRefs.current).forEach((el) => {
      if (el) currentObserver.observe(el);
    });

    return () => currentObserver.disconnect();
  }, [posts]);

  const handleUserProfileClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const incrementViewCount = async (postId: string) => {
    if (viewedPostIds.current.has(postId)) {
      return;
    }

    try {
      const result = await postService.markAsViewed(postId);

      if (result.incrementView) {
        setPostCounters((prevCounters) => ({
          ...prevCounters,
          [postId]: {
            ...prevCounters[postId],
            viewCount: (prevCounters[postId]?.viewCount || 0) + 1,
          },
        }));
        viewedPostIds.current.add(postId);
      } else {
        viewedPostIds.current.add(postId);
      }
    } catch (err) {
      console.error(`Error incrementing view count for post ${postId}:`, err);
    }
  };

  const handleLikeToggle = async (postId: string) => {
    if (!likedMap) {
      console.error("likedMap is not initialized!");
      return;
    }
    const currentlyLiked = !!likedMap[postId];

    try {
      if (!currentlyLiked) {
        const result = await postService.likePost(postId);

        if (result?.success === false) return;

        setLikedMap((prev) => ({ ...prev, [postId]: true }));
        setPostCounters((prevCounters) => ({
          ...prevCounters,
          [postId]: {
            ...prevCounters[postId],
            likeCount: (prevCounters[postId]?.likeCount || 0) + 1,
          },
        }));
      } else {
        const result = await postService.unlikePost(postId);

        if (result?.success === false) return;

        setLikedMap((prev) => ({ ...prev, [postId]: false }));
        setPostCounters((prevCounters) => ({
          ...prevCounters,
          [postId]: {
            ...prevCounters[postId],
            likeCount: Math.max((prevCounters[postId]?.likeCount || 0) - 1, 0),
          },
        }));
      }
    } catch (err) {
      console.error(`Error toggling like for post ${postId}:`, err);
    }
  };

  const setPostRef = (postId: string) => (el: HTMLDivElement | null) => {
    postRefs.current[postId] = el;
  };

  if (loading) return <p className="loading-text">در حال بارگذاری پست‌ها...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <PageContainer>
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p>{error}</p>
      ) : posts.length === 0 ? (
        <p>هیچ پستی وجود ندارد.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            postCounters={postCounters}
            isLiked={likedMap[post.id]}
            onLikeToggle={handleLikeToggle}
            onNavigate={handleUserProfileClick}
            setPostRef={setPostRef}
          />
        ))
      )}
    </PageContainer>
  );
}
