import { useEffect, useMemo, useState } from "react";
import { userService } from "../../services/userService";
import type { UsersListItemDto } from "../../dtos/userDtos";
import type { PostListItemDto } from "../../dtos/postDtos";
import { postService } from "../../services/postService";
import BlobAvatar from "../../components/ui/Image/BlobAvatar";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/ui/Modal/Modal";
import type {
  PostWithMediaBlob,
  UsersListWithAvatarBlob,
  UserWithAvatarBlob,
} from "../../interfaces/userInterfaces";
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import PostsGrid from "../../components/features/post/PostsGrid";
import UsersList from "../../components/features/user/UsersList";
import UserStats from "../../components/features/user/UserStats";

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserWithAvatarBlob | null>(
    null,
  );
  const [userPosts, setUserPosts] = useState<PostWithMediaBlob[]>([]);
  const [userId, setUserId] = useState<string>("");

  const [isFollowersModalOpen, setIsFollowersModalOpen] =
    useState<boolean>(false);
  const [isFollowingsModalOpen, setIsFollowingsModalOpen] =
    useState<boolean>(false);
  const [followersList, setFollowersList] = useState<UsersListWithAvatarBlob[]>(
    [],
  );
  const [followingsList, setFollowingsList] = useState<
    UsersListWithAvatarBlob[]
  >([]);

  const navigate = useNavigate();

  const handleEditProfileBtn = () => {
    navigate("/profile/edit");
  };

  const storeUserIdInLocalStorage = (id: string) => {
    localStorage.setItem("userId", id);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const myIdResponse = await userService.getMyId();
        const id = myIdResponse.id;
        storeUserIdInLocalStorage(id);
        setUserId(id);

        const info = await userService.getUser(id);

        let blob: Blob | undefined = undefined;
        try {
          blob = await userService.getAvatar(id);
        } catch (e: any) {
          if (e?.response?.status === 404) {
            blob = undefined;
          } else {
            throw e;
          }
        }

        setUserProfile({ ...info, avatarBlob: blob });

        const fetchedUserPostsList: PostListItemDto[] =
          await userService.getUserPosts(id);

        const postsWithMedia: PostWithMediaBlob[] = await Promise.all(
          fetchedUserPostsList.map(async (postListItem: PostListItemDto) => {
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

        setUserPosts(postsWithMedia);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("خطا در بارگذاری پروفایل");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUserListItemClick = (userId: string) => {
    navigate(`/user/${userId}`);
    setIsFollowersModalOpen(false);
    setIsFollowingsModalOpen(false);
  };

  const fetchFollowersList = async () => {
    try {
      const followersListData: UsersListItemDto[] =
        await userService.getFollowers(userId);
      const followersWithAvatarBlob: UsersListWithAvatarBlob[] =
        await Promise.all(
          followersListData.map(async (userListItem) => {
            let avatarBlob: Blob | undefined = undefined;
            try {
              avatarBlob = await userService.getAvatar(userListItem.id);
            } catch (e: any) {
              if (e?.response?.status === 404) {
                avatarBlob = undefined;
              } else {
                throw e;
              }
            }
            return { ...userListItem, avatarBlob };
          }),
        );
      setFollowersList(followersWithAvatarBlob);
      setIsFollowersModalOpen(true);
    } catch (error) {
      console.error("Error fetching followers:", error);
      setError("خطا در بارگذاری لیست دنبال‌کنندگان");
    }
  };

  const fetchFollowingsList = async () => {
    try {
      const followingsListData: UsersListItemDto[] =
        await userService.getFollowings(userId);
      const followingsWithAvatarBlob: UsersListWithAvatarBlob[] =
        await Promise.all(
          followingsListData.map(async (userListItem) => {
            let avatarBlob: Blob | undefined = undefined;
            try {
              avatarBlob = await userService.getAvatar(userListItem.id);
            } catch (e: any) {
              if (e?.response?.status === 404) {
                avatarBlob = undefined;
              } else {
                throw e;
              }
            }
            return { ...userListItem, avatarBlob };
          }),
        );
      setFollowingsList(followingsWithAvatarBlob);
      setIsFollowingsModalOpen(true);
    } catch (error) {
      console.error("Error fetching followers:", error);
      setError("خطا در بارگذاری لیست دنبال‌شوندگان");
    }
  };

  const renderedFollowersListItems = (
    <UsersList
      usersList={followersList}
      handleListItemClick={handleUserListItemClick}
    />
  );

  const renderedFollowingsListItems = (
    <UsersList
      usersList={followingsList}
      handleListItemClick={handleUserListItemClick}
    />
  );

  const followerInfo = useMemo(() => {
    if (!userProfile) return null;
    return (
      <UserStats
        followerCount={userProfile.followerCount}
        followingCount={userProfile.followingCount}
        fetchFollowersList={fetchFollowersList}
        fetchFollowingsList={fetchFollowingsList}
      />
    );
  }, [userProfile]);

  if (loading)
    return <p className="loading-text">در حال بارگذاری پروفایل کاربری...</p>;

  if (error) return <p className="error-text">{error}</p>;

  if (!userProfile) return null;

  return (
    <PageContainer>
      {isFollowersModalOpen && (
        <Modal
          title="لیست دنبال‌کنندگان"
          isOpen={isFollowersModalOpen}
          onClose={() => setIsFollowersModalOpen(false)}
        >
          {followersList.length > 0 ? (
            renderedFollowersListItems
          ) : (
            <p>شما هیچ دنبال‌کننده‌ای ندارید.</p>
          )}
        </Modal>
      )}
      {isFollowingsModalOpen && (
        <Modal
          title="لیست دنبال‌شوندگان"
          isOpen={isFollowingsModalOpen}
          onClose={() => setIsFollowingsModalOpen(false)}
        >
          {followingsList.length > 0 ? (
            renderedFollowingsListItems
          ) : (
            <p>شما کسی را دنبال‌ نمی‌کنید.</p>
          )}
        </Modal>
      )}
      <header className="user-info-container">
        <BlobAvatar
          blob={userProfile.avatarBlob}
          isBigAvatar={true}
        />

        <div className="user-info-text">
          <div className="username-big">
            {userProfile.userName || "کاربر ناشناس"}
          </div>
          {userProfile.displayName ? (
            <div className="display-name">
              {userProfile.displayName || "بی‌نام"}
            </div>
          ) : null}
          {userProfile.bio ? (
            <div className="bio">{userProfile.bio}</div>
          ) : null}
          {followerInfo}
        </div>
        <div className="profile-actions">
          <button
            type="button"
            className="edit-profile-btn"
            onClick={handleEditProfileBtn}
          >
            ویرایش
          </button>
          <button
            type="button"
            className="new-post-btn"
            onClick={() => navigate("/post/new")}
          >
            پست جدید
          </button>
        </div>
      </header>

      <main className="user-posts-container">
        {userPosts.length === 0 ? (
          <p className="empty-text">هنوز پستی برای نمایش وجود ندارد.</p>
        ) : (
          <PostsGrid posts={userPosts} />
        )}
      </main>
    </PageContainer>
  );
}

export default ProfilePage;
