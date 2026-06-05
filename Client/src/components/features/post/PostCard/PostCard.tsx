import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import type {
  CreateCommentDto,
  CommentListItemDto,
} from "../../../../dtos/commentDtos";
import type { PostDto } from "../../../../dtos/postDtos";
import useIsDesktop from "../../../../hooks/useIsDesktop";
import type { CommentData } from "../../../../interfaces/commentInterfaces";
import type { ContextMenuItemData } from "../../../../interfaces/menuInterfaces";
import type {
  PostWithDisplayData,
  PostCounters,
} from "../../../../interfaces/postInterfaces";
import { commentService } from "../../../../services/commentService";
import { postService } from "../../../../services/postService";
import { userService } from "../../../../services/userService";
import styles from "./PostCard.module.css";
import BlobImage from "../../../ui/Image/BlobImage";
import type { DialogType } from "../../../../types/DialogType";
import { CiEdit } from "react-icons/ci";
import CommentsModal from "../../commenting/CommentsModal/CommentsModal";
import Modal from "../../../ui/Modal/Modal";
import OkCancelDialog from "../../../ui/OkCancelDialog/OkCancelDialog";
import TextBoxDialog from "../../../ui/TextBoxDialog/TextBoxDialog";
import CommentForm from "../../commenting/CommentForm/CommentForm";
import CommentList from "../../commenting/CommentList/CommentList";
import LikeMeta from "../LikeMeta/LikeMeta";
import PostCaption from "../PostCaption/PostCaption";
import PostHeader from "../PostHeader/PostHeader";
import ViewMeta from "../ViewMeta/ViewMeta";

type PostCardProps = {
  id?: string;
};

const PostCard = ({ id }: PostCardProps) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop(769);

  const [dialog, setDialog] = useState<DialogType>();
  const [updateDialogVisible, setUpdateDialogVisible] =
    useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  const [newCaption, setNewCaption] = useState<string>();

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
    if (!id) {
      setError("خطا در بارگذاری پست: شناسه پست نامعتبر است.");
      return;
    }
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
  var commentsCountElement = (
    <p className={styles.commentsCount} onClick={handleCommentsCountClick}>
      {post.commentsCount.toLocaleString("fa-Ir")} عدد نظرات
    </p>
  );

  var postMediaElement = post.mediaBlob ? (
    <div className={styles.mediaContainer}>
      <BlobImage
        blob={post.mediaBlob}
        alt="Post Media"
        className={styles.media}
      />
    </div>
  ) : (
    <div className={styles.mediaContainer}>
      <p className={styles.media}>رسانه موجود نیست.</p>
    </div>
  );

  const deleteOption: ContextMenuItemData = {
    icon: <MdDeleteOutline />,
    label: "حذف",
    forColor: "red",
    action: () => {
      setDialog({
        title: "حذف پست",
        children: "آیا از حذف این پست مطمئن هستید؟",
      });
      setDeleteDialogVisible(true);
    },
  };

  const handleUpdateCaption = async () => {
    {
      const res = await postService.updatePostCaption(post.id, {
        caption: newCaption,
      });
      console.log(res);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              caption: newCaption ?? "",
            }
          : prev,
      );
      setUpdateDialogVisible(false);
    }
  };

  const editOption: ContextMenuItemData = {
    icon: <CiEdit />,
    label: "ویرایش",
    action: () => {
      setDialog({
        title: "توضیحات پست را ویرایش کنید.",
      });
      setNewCaption(post?.caption ?? "");
      setUpdateDialogVisible(true);
    },
  };

  const postHeaderOptions: ContextMenuItemData[] = post.isYours
    ? [deleteOption, editOption]
    : [];

  return (
    <>
      <CommentsModal
        comments={comments}
        isLoading={loading}
        isPosting={isPostingAComment}
        isOpen={isCommentsListModalOpen}
        setIsOpen={setIsCommentsListOpen}
        setIsCommentsListOpen={setIsCommentsListOpen}
        handleCommentFormSubmit={handleCommentFormSubmit}
        handleDeleteComment={handleDeleteComment}
        handleNavigateToUser={handleNavigateToUser}
      />

      <Modal
        isOpen={deleteDialogVisible}
        setIsOpen={setDeleteDialogVisible}
        title={dialog?.title}
      >
        <OkCancelDialog
          onOk={() => handleDeletePost()}
          onCancel={() => setDeleteDialogVisible(false)}
        >
          {dialog?.children}
        </OkCancelDialog>
      </Modal>

      <Modal
        isOpen={updateDialogVisible}
        setIsOpen={setUpdateDialogVisible}
        title={dialog?.title}
      >
        <TextBoxDialog
          caption={newCaption ?? ""}
          setCaption={setNewCaption}
          onCancel={() => setUpdateDialogVisible(false)}
          onSubmit={handleUpdateCaption}
        />
      </Modal>

      <div className={styles.postCard}>
        {isDesktop ? (
          <>
            <div className={styles.postContent}>
              <PostHeader
                avatarBlob={post.avatarBlob}
                username={post.postOwnerUserName}
                onUserInfoClick={() => handleNavigateToUser(post.postOwnerId)}
                options={postHeaderOptions}
                extraClassNames={styles.postHeader}
              />

              <CommentList
                comments={comments}
                isCommentsLoading={isCommentsLoading}
                onNavigateToUser={handleNavigateToUser}
                onDeleteComment={handleDeleteComment}
              >
                <PostCaption
                  caption={post?.caption}
                  extraClassNames={styles.desktopCaption}
                />
              </CommentList>

              <div className={styles.interactionsRow}>
                <LikeMeta
                  isLiked={isLiked}
                  likeCount={postCounters[post.id].likeCount}
                  handleLikeToggle={() => handleLikeToggle(postIdString)}
                />
                <ViewMeta viewCount={postCounters[post.id].viewCount} />
              </div>

              <CommentForm
                isPostingAComment={isPostingAComment}
                onSubmitComment={handleCommentFormSubmit}
              />
            </div>

            {postMediaElement}
          </>
        ) : (
          <>
            <PostHeader
              avatarBlob={post.avatarBlob}
              username={post.postOwnerUserName}
              onUserInfoClick={() => handleNavigateToUser(post.postOwnerId)}
              options={postHeaderOptions}
            />
            {postMediaElement}
            <div className={styles.postContent}>
              <div className={styles.interactionRow}>
                <LikeMeta
                  isLiked={isLiked}
                  likeCount={postCounters[post.id].likeCount}
                  handleLikeToggle={() => handleLikeToggle(postIdString)}
                />
              </div>
              <PostCaption caption={post?.caption} />
              {commentsCountElement}
              <ViewMeta viewCount={postCounters[post.id].viewCount} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PostCard;
