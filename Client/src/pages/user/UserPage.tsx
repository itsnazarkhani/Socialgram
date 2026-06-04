import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserDto, UsersListItemDto } from "../../dtos/userDtos";
import BlobAvatar from "../../components/ui/Image/BlobAvatar";
import { postService } from "../../services/postService";
import { userService } from "../../services/userService";
import "./ProfilePage.css";
import type {
  PostWithMediaBlob,
  UsersListWithAvatarBlob,
  UserWithAvatarBlob,
} from "../../interfaces/userInterfaces";
import Modal from "../../components/ui/Modal/Modal";
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import PostsGrid from "../../components/features/post/PostsGrid";
import UsersList from "../../components/features/user/UsersList";
import UserStats from "../../components/features/user/UserStats";

const UserPage: React.FC = () => {
  const { id }: { id?: string } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserWithAvatarBlob | null>(
    null,
  );
  const [userPosts, setUserPosts] = useState<PostWithMediaBlob[]>([]);

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

  const [followLoading, setFollowLoading] = useState(false);

  const handleFollowToggle = async () => {
    if (!userProfile?.id) return;

    try {
      setFollowLoading(true);

      if (userProfile.isFollowing) {
        await userService.unfollowUser(userProfile.id);
      } else {
        await userService.followUser(userProfile.id);
      }

      const updated: UserDto = await userService.getUser(userProfile.id);

      setUserProfile({
        ...userProfile,
        isFollowing: updated.isFollowing,
        followerCount: updated.followerCount,
        followingCount: updated.followingCount,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("شناسه کاربر نامعتبر است");
      setLoading(false);
      return;
    }

    let isActive = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setUserProfile(null);
        setUserPosts([]);

        const info = await userService.getUser(id);

        let blob: Blob | undefined = undefined;
        try {
          blob = await userService.getAvatar(id);
        } catch (e: any) {
          if (e?.response?.status !== 404) throw e;
        }

        const fetchedUserPostsList = await userService.getUserPosts(id);

        const postsWithMedia = await Promise.all(
          fetchedUserPostsList.map(async (postListItem) => {
            try {
              const mediaBlob = await postService.getMedia(postListItem.id);
              return { ...postListItem, mediaBlob };
            } catch {
              return { ...postListItem, mediaBlob: undefined };
            }
          }),
        );

        if (!isActive) return;

        setUserProfile({ ...info, avatarBlob: blob });
        setUserPosts(postsWithMedia);
      } catch (err) {
        if (!isActive) return;
        console.error("Error fetching profile:", err);
        setError("خطا در بارگذاری پروفایل");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleUserListItemClick = (userId: string) => {
    navigate(`/user/${userId}`);
    setIsFollowersModalOpen(false);
    setIsFollowingsModalOpen(false);
  };

  const fetchFollowersList = async () => {
    try {
      const followersListData: UsersListItemDto[] =
        await userService.getFollowers(id);
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
        await userService.getFollowings(id);
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
            <p>کاربر هیچ دنبال‌کننده‌ای ندارد.</p>
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
            <p>کاربر کسی را دنبال‌ نمی‌کند.</p>
          )}
        </Modal>
      )}
      <header className="user-info-container">
        {userProfile.avatarBlob ? (
          <BlobAvatar
            blob={userProfile.avatarBlob}
            isBigAvatar={true}
            handleClick={{}}
          />
        ) : (
          <div className="user-big-avatar" />
        )}

        <div className="user-info-text">
          <div className="username-big">
            {userProfile.userName || "کاربر ناشناس"}
          </div>

          {userProfile.displayName ? (
            <div className="display-name">{userProfile.displayName}</div>
          ) : null}

          {userProfile.bio ? (
            <div className="bio">{userProfile.bio}</div>
          ) : null}

          {followerInfo}
        </div>

        {!userProfile.isYou && (
          <button
            type="button"
            className="follow-btn"
            disabled={followLoading}
            onClick={handleFollowToggle}
          >
            {followLoading
              ? "..."
              : userProfile.isFollowing
                ? "Following"
                : "Follow"}
          </button>
        )}
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
};

export default UserPage;
