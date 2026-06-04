import type {
  CreateCommentDto,
  CommentListItemDto,
} from "../../../../dtos/commentDtos";
import type {
  PostWithDisplayData,
  PostCounters,
} from "../../../../interfaces/postInterfaces";
import { commentService } from "../../../../services/commentService";
import { postService } from "../../../../services/postService";
import { userService } from "../../../../services/userService";
import BlobAvatar from "../../../ui/Image/BlobAvatar";
import BlobImage from "../../../ui/Image/BlobImage";
import Modal from "../../../ui/Modal/Modal";
import type { CommentData } from "../../../../interfaces/commentInterfaces";
import CommentForm from "../../commenting/CommentForm/CommentForm";
import "./PostCard.css";
import { useEffect, useState } from "react";
import LikeButton from "../../../ui/Buttons/LikeButton/LikeButton";
import CommentList from "../../commenting/CommentList/CommentList";
import CommentsModal from "../../commenting/CommentsModal/CommentsModal";

type PostCardProps = {
  post: PostWithDisplayData;
  postCounters: {
    viewCount: 0;
    likeCount: 0;
  };
  isLiked: boolean;
  onNavigate: (userId: string) => void;
  onLikeToggle: (postId: string) => void;
  setPostRef: (postId: string) => (el: HTMLDivElement | null) => void;
};

const PostCard = ({
  post,
  postCounters,
  isLiked,
  onNavigate,
  onLikeToggle,
  setPostRef,
}: PostCardProps) => {
  const [currentPost, setCurrentPost] = useState<PostWithDisplayData>();
  const counters = postCounters[post.id] || { viewCount: 0, likeCount: 0 };

  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentData[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(false);
  const [isCommentsListModalOpen, setIsCommentsListOpen] =
    useState<boolean>(false);

  const [isPostingAComment, setIsPostingAComment] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPost(post);
  }, []);

  const handleCommentFormSubmit = async (commentText: string) => {
    const commentDto: CreateCommentDto = {
      text: commentText,
    };
    try {
      const postACommentResponse = await postService.postAComment(
        currentPost.id,
        commentDto,
      );
      setCurrentPost({
        ...currentPost,
        commentsCount: currentPost.commentsCount + 1,
      });
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
      const commentsList: CommentListItemDto[] = await postService.getComments(
        currentPost.id,
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

  const handleDeleteComment = async (commentId: string) => {
    await postService.deleteMyComment(currentPost.id, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setCurrentPost({
      ...currentPost,
      commentsCount: currentPost.commentsCount - 1,
    });
  };

  const commentsModalContent = (
    <div className="comments-list-container">
      <CommentList
        comments={comments}
        isCommentsLoading={isCommentsLoading}
        onNavigateToUser={onNavigate}
        onDeleteComment={handleDeleteComment}
      />
      <CommentForm
        isPostingAComment={isPostingAComment}
        onSubmitComment={handleCommentFormSubmit}
        extraClassNames="modal-comment-form"
      />
    </div>
  );

  if (error) return <p className="error-text">{error}</p>;

  if (!currentPost)
    return <p className="empty-text">پستی برای نمایش وجود ندارد.</p>;

  let commentsCountElement = null;
  if (currentPost.commentsCount)
    commentsCountElement = (
      <p
        className="comments-count comments-count-currentPost-page"
        onClick={handleCommentsCountClick}
      >
        {currentPost.commentsCount} عدد نظرات
      </p>
    );

  return (
    <div
      key={currentPost.id}
      ref={setPostRef(currentPost.id)}
      data-id={currentPost.id}
      className="post-card"
    >
      <CommentsModal
        comments={comments}
        isLoading={false}
        isPosting={isPostingAComment}
        isOpen={isCommentsListModalOpen}
        setIsCommentsListOpen={setIsCommentsListOpen}
        handleCommentFormSubmit={handleCommentFormSubmit}
        handleDeleteComment={handleDeleteComment}
        handleNavigateToUser={onNavigate}
      />
      <div className="post-card-user-info-container">
        {currentPost.avatarBlob ? (
          <BlobAvatar
            blob={currentPost.avatarBlob}
            isBigAvatar={false}
            handleClick={() => onNavigate(currentPost.postOwnerId)}
          />
        ) : (
          <div
            className="user-avatar"
            onClick={() => onNavigate(currentPost.postOwnerId)}
          />
        )}
        <span
          className="username"
          onClick={() => onNavigate(currentPost.postOwnerId)}
        >
          {currentPost.postOwnerUserName || "کاربر ناشناس"}
        </span>
      </div>

      {currentPost.mediaBlob ? (
        <BlobImage
          blob={currentPost.mediaBlob}
          alt="Post Media"
          className="post-media"
        />
      ) : (
        <p className="post-meta">رسانه موجود نیست.</p>
      )}

      <h4 className={`post-caption ${currentPost.caption || "no-caption"}`}>
        {currentPost.caption || "بدون عنوان"}
      </h4>
      {commentsCountElement}
      <div className="post-meta-container">
        <p className="post-meta">تعداد بازدید: {counters.viewCount ?? 0}</p>
        <p className="post-meta">تعداد لایک: {counters.likeCount ?? 0}</p>
      </div>

      <LikeButton
        isLiked={isLiked}
        onClick={() => onLikeToggle(currentPost.id)}
      />

      <CommentForm
        isPostingAComment={isPostingAComment}
        onSubmitComment={handleCommentFormSubmit}
        extraClassNames={`post-card-comment-form`}
      />
    </div>
  );
};

export default PostCard;
