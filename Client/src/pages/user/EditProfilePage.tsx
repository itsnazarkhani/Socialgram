import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { userService } from "../../services/userService";
import BlobAvatar from "../../components/ui/Image/BlobAvatar";
import "./EditProfilePage.css";
import type { UserWithAvatarBlob } from "../../interfaces/userInterfaces";
import PageContainer from "../../components/layout/PageContainer/PageContainer";
import { GrUpdate } from "react-icons/gr";
import { UseToast } from "../../context/ToastContext";

const EditProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const [updateAvatarLoading, setUpdateAvatarLoading] = useState(false);

  const toast = UseToast();

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
        toast.current?.show({
          severity: "success",
          summary: "موفق",
          detail: "عکس پروفایل با موفقیت بروزرسانی شد.",
          life: 3000,
        });
      } catch (err: any) {
        toast.current?.show({
          severity: "error",
          summary: "خطا",
          detail: err?.response?.data?.message || "خطا در آپلود آواتار",
          life: 5000,
        });
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

      toast.current?.show({
        severity: "success",
        summary: "موفق",
        detail: "پروفایل با موفقیت بروزرسانی شد!",
        life: 3000,
      });
      navigate("/profile");
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "خطا",
        detail: err?.response?.data?.message || "خطا در بروزرسانی پروفایل",
        life: 5000,
      });
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  if (loading) return <p className="loading-text">در حال بارگذاری ...</p>;

  if (error) return <p className="error-text">{error}</p>;

  if (!userProfile) return null;

  return (
    <PageContainer extraClassNames="edit-profile-page-container" withPadding={false}>
      <header className="edit-avatar-container">
        <BlobAvatar blob={userProfile.avatarBlob} isBigAvatar={true} />

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

        <button
          className="updateBtn"
          disabled={updateProfileLoading}
          type="submit"
        >
          {updateProfileLoading ? (
            "درحال بروزرسانی..."
          ) : (
            <>
              بروزرسانی <GrUpdate />
            </>
          )}
        </button>
      </form>
    </PageContainer>
  );
};

export default EditProfilePage;
