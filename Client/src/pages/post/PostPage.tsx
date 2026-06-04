import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  PostWithDisplayData,
  PostCounters,
} from "../../interfaces/postInterfaces";
import type { PostDto } from "../../dtos/postDtos";
import { postService } from "../../services/postService";
import { userService } from "../../services/userService";
import BlobImage from "../../components/ui/Image/BlobImage";
import styles from "./PostPage.module.css";
import type {
  CommentListItemDto,
  CreateCommentDto,
} from "../../dtos/commentDtos";
import { commentService } from "../../services/commentService";
import type { CommentData } from "../../interfaces/commentInterfaces";
import useIsDesktop from "../../hooks/useIsDesktop";
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import CommentForm from "../../components/features/commenting/CommentForm/CommentForm";
import CommentsModal from "../../components/features/commenting/CommentsModal/CommentsModal";
import LikeButton from "../../components/ui/Buttons/LikeButton/LikeButton";
import PostHeader from "../../components/ui/PostHeader/PostHeader";
import type { ContextMenuItemData } from "../../interfaces/menuInterfaces";
import { MdDeleteOutline } from "react-icons/md";
import PostMeta from "../../components/features/post/PostMeta/PostMeta";
import PostCaption from "../../components/features/post/PostCaption/PostCaption";
import CommentList from "../../components/features/commenting/CommentList/CommentList";

const PostPage = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop(769);
  const { id }: { id?: string } = useParams();

  const [post, setPost] = useState<PostWithDisplayData>();
  const [postCounters, setPostCounters] = useState<PostCounters>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentData[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);
  const [isCommentsListModalOpen, setIsCommentsListOpen] =
    useState<boolean>(false);

  const [isPostingAComment, setIsPostingAComment] = useState<boolean>(false);

  useEffect(() => {
    if (isCommentsListModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCommentsListModalOpen]);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchPostAndMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPost: PostDto = await postService.getPostById(
          id as string,
        );

        const initialCounters: PostCounters = {};

        let mediaBlob: Blob | undefined = undefined;
        let avatarBlob: Blob | undefined = undefined;

        try {
          mediaBlob = await postService.getMedia(fetchedPost.id);
        } catch (mediaError) {
          console.error(
            `Error fetching media for post ${fetchedPost.id}:`,
            mediaError,
          );
        }

        if (fetchedPost.postOwnerId) {
          try {
            avatarBlob = await userService.getAvatar(fetchedPost.postOwnerId);
          } catch (avatarError: any) {
            if (avatarError?.response?.status == 404) avatarBlob = undefined;
            else throw avatarError;
          }
        }

        initialCounters[fetchedPost.id] = {
          viewCount: fetchedPost.viewCount ?? 0,
          likeCount: fetchedPost.likeCount ?? 0,
        };

        setLikedMap((prev) => ({
          ...prev,
          [fetchedPost.id]: fetchedPost.didYouLiked,
        }));
        setPost({ ...fetchedPost, avatarBlob, mediaBlob });
        setPostCounters(initialCounters);
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError("خطا در بارگذاری پست");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndMedia();
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    if (hasFetchedRef.current) return;
    if (!post) return;

    fetchComments();
    hasFetchedRef.current = true;
  }, [isDesktop, post?.id]);

  useEffect(() => {
    hasFetchedRef.current = false;
  }, [post?.id]);

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

  const handleCommentFormSubmit = async (commentText: string) => {
    const commentDto: CreateCommentDto = {
      text: commentText,
    };
    try {
      if (!post) return;

      const postACommentResponse = await postService.postAComment(
        post.id,
        commentDto,
      );
      setPost({ ...post, commentsCount: post.commentsCount + 1 });
      const newComment: CommentListItemDto =
        await commentService.getCommentById(postACommentResponse?.id);
      let avatarBlob: Blob | undefined;
      try {
        avatarBlob = await userService.getAvatar(newComment.userId);
      } catch (err: any) {
        if (err?.response?.status === 404) avatarBlob = undefined;
        else throw err;
      }
      const newCommentWithAvatar: CommentData = {
        ...newComment,
        avatarBlob,
      };
      setComments((prev) => [newCommentWithAvatar, ...prev]);
    } catch (err: any) {
      console.error("Error posting a comment:", err);
    } finally {
      setIsPostingAComment(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsCommentsLoading(true);
      if (!post) return;
      const commentsList: CommentListItemDto[] = await postService.getComments(
        post.id,
      );
      const commentsListWithUserAvatarBlobs: CommentData[] = await Promise.all(
        commentsList.map(async (cm) => {
          let avatarBlob: Blob | undefined;
          try {
            avatarBlob = await userService.getAvatar(cm.userId);
          } catch (avatarError: any) {
            if (avatarError?.response?.status == 404) avatarBlob = undefined;
            else throw avatarError;
          }

          return { ...cm, avatarBlob };
        }),
      );
      setComments(commentsListWithUserAvatarBlobs);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setError("خطا در بارگذاری نظرات");
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handleCommentsCountClick = () => {
    fetchComments();
    setIsCommentsListOpen(true);
  };

  const handleNavigateToUser = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!post) return;

    await postService.deleteMyComment(post.id, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPost({ ...post, commentsCount: post.commentsCount - 1 });
  };

  const handleDeletePost = async () => {
    try {
      if (!post) return;

      await postService.deletePost(post.id);
      navigate("/profile");
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (loading) return <p className="loading-text">در حال بارگذاری پست‌ها...</p>;
  if (error) return <p className="error-text">{error}</p>;

  if (!post) return <p className="empty-text">پستی برای نمایش وجود ندارد.</p>;

  const postIdString = post.id;
  const isLiked = !!likedMap?.[postIdString];
  var commentsCountElement = null;
  if (post.commentsCount)
    commentsCountElement = (
      <p
        className="comments-count comments-count-post-page"
        onClick={handleCommentsCountClick}
      >
        {post.commentsCount} عدد نظرات
      </p>
    );

  var postMediaElement = post.mediaBlob ? (
    <BlobImage
      blob={post.mediaBlob}
      alt="Post Media"
      className="post-media post-media-big"
    />
  ) : (
    <p className="post-meta">رسانه موجود نیست.</p>
  );

  const deleteOption: ContextMenuItemData = {
    icon: <MdDeleteOutline />,
    text: "حذف",
    forColor: "red",
    onClick: () => handleDeletePost(),
  };

  const postHeaderOptions: ContextMenuItemData[] = post.isYours
    ? [deleteOption]
    : [];

  return (
    <PageContainer>
      <CommentsModal
        comments={comments}
        isLoading={loading}
        isPosting={isPostingAComment}
        isOpen={isCommentsListModalOpen}
        setIsCommentsListOpen={setIsCommentsListOpen}
        handleCommentFormSubmit={handleCommentFormSubmit}
        handleDeleteComment={handleDeleteComment}
        handleNavigateToUser={handleNavigateToUser}
      />

      <div className={styles.page}>
        <div className={styles.postCard}>
          {isDesktop ? (
            <>
              <PostHeader
                avatarBlob={post.avatarBlob}
                username={post.postOwnerUserName}
                onUserInfoClick={() => handleNavigateToUser(post.postOwnerId)}
                options={postHeaderOptions}
              />

              <PostCaption caption={post.caption} />

              <CommentList
                comments={comments}
                isCommentsLoading={isCommentsLoading}
                onNavigateToUser={handleNavigateToUser}
                onDeleteComment={handleDeleteComment}
              />

              <LikeButton
                isLiked={isLiked}
                onClick={() => handleLikeToggle(postIdString)}
                extraClassNames={""}
              />
              <PostMeta viewCount={postCounters[post.id].viewCount} />

              <CommentForm
                isPostingAComment={isPostingAComment}
                onSubmitComment={handleCommentFormSubmit}
              />
            </>
          ) : (
            <>
              <PostHeader
                avatarBlob={post.avatarBlob}
                username={post.postOwnerUserName}
                onUserInfoClick={() => handleNavigateToUser(post.postOwnerId)}
                options={postHeaderOptions}
              />
              <div className={styles.media}>{postMediaElement}</div>
              <div className={styles.postContent}>
                <LikeButton
                  isLiked={isLiked}
                  onClick={() => handleLikeToggle(postIdString)}
                  extraClassNames={""}
                />
                <PostCaption caption={post.caption} />
                {commentsCountElement}
                <PostMeta viewCount={postCounters[post.id].viewCount} />
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default PostPage;
