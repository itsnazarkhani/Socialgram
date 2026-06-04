import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { userService } from "../../services/userService";
import BlobAvatar from "../../components/ui/Image/BlobAvatar";
import "./EditProfilePage.css";
import type { UserWithAvatarBlob } from "../../interfaces/userInterfaces";
import PageContainer from "../../components/layout/PageContainer/PageContainer";

const EditProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const [updateAvatarLoading, setUpdateAvatarLoading] = useState(false);

  const [userProfile, setUserProfile] = useState<UserWithAvatarBlob | null>(
    null,
  );
  const [displayNameInput, setDisplayNameInput] = useState<string>("");
  const [bioInput, setBioInput] = useState<string>("");

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/profile");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);

        const info = await userService.getUser(userId);

        let blob: Blob | undefined = undefined;
        try {
          blob = await userService.getAvatar(userId);
        } catch (e: any) {
          if (e?.response?.status === 404) {
            blob = undefined;
          } else {
            throw e;
          }
        }

        setUserProfile({ ...info, avatarBlob: blob });
        setDisplayNameInput(info.displayName || "");
        setBioInput(info.bio || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("خطا در بارگذاری پروفایل");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, navigate]);

  const handleUpdateAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && userId) {
      try {
        setUpdateAvatarLoading(true);
        setError(null);

        await userService.updateAvatar(file);

        setUserProfile((prev) => (prev ? { ...prev, avatarBlob: file } : null));
      } catch (err: any) {
        console.error("Error uploading avatar:", err);
        setError(err?.response?.data?.message || "خطا در آپلود آواتار");
      } finally {
        setUpdateAvatarLoading(false);
        if (event.target) {
          event.target.value = "";
        }
      }
    }
  };

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !userProfile) return;

    try {
      setUpdateProfileLoading(true);
      setError(null);

      const updateData = {
        displayName: displayNameInput,
        bio: bioInput,
      };

      const updatedUserProfile = await userService.updateProfile(updateData);

      setUserProfile((prev) =>
        prev
          ? ({
              ...updatedUserProfile,
              avatarBlob: userProfile.avatarBlob,
            } as UserWithAvatarBlob)
          : null,
      );

      alert("پروفایل با موفقیت بروزرسانی شد!");
      navigate("/profile");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err?.response?.data?.message || "خطا در بروزرسانی پروفایل");
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  if (loading) return <p className="loading-text">در حال بارگذاری ...</p>;

  if (error) return <p className="error-text">{error}</p>;

  if (!userProfile) return null;

  return (
    <PageContainer extraClassNames="edit-profile-page-container">
      <header className="edit-avatar-container">
        {userProfile.avatarBlob ? (
          <BlobAvatar
            blob={userProfile.avatarBlob}
            isBigAvatar={true}
            handleClick={{}}
          />
        ) : (
          <div className="user-big-avatar" />
        )}
        <div className="column-flex-container">
          <div className="username-big">
            {userProfile.userName || "کاربر ناشناس"}
          </div>

          <button
            type="button"
            id="edit-avatar-btn"
            onClick={handleUpdateAvatarClick}
            disabled={updateAvatarLoading}
          >
            {updateAvatarLoading ? "در حال آپلود..." : "بروزرسانی آواتار"}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarFileChange}
            style={{ display: "none" }}
          />
        </div>
      </header>

      <form id="edit-profile-form" onSubmit={handleUpdateProfileSubmit}>
        <input
          className="text-box"
          value={displayNameInput}
          onChange={(e) => setDisplayNameInput(e.target.value)}
          placeholder="نام نمایه"
          autoComplete="name"
        />

        <textarea
          className="text-box"
          value={bioInput}
          onChange={(e) => setBioInput(e.target.value)}
          placeholder="بیوگرافی"
        />

        <button disabled={updateProfileLoading} type="submit">
          {updateProfileLoading ? "درحال بروزرسانی..." : "بروزرسانی"}
        </button>
      </form>
    </PageContainer>
  );
};

export default EditProfilePage;
