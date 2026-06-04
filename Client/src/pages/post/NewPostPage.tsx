import { useRef, useState } from "react";
import "./NewPostPage.css";
import { useNavigate } from "react-router-dom";
import type { CreatePostDto } from "../../dtos/postDtos";
import { postService } from "../../services/postService";
import BlobImage from "../../components/ui/Image/BlobImage";
import PageContainer from "../../components/layout/PageContainer/PageContainer";

const NewPostPage = () => {
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>(null);
  const [postImage, setPostImage] = useState<Blob | undefined>();

  const [caption, setCaption] = useState<string>("");
  const [createPostLoading, setCreatePostLoading] = useState<boolean>(false);

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handlePostFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          const blob = new Blob([reader.result]);
          setPostImage(blob);
        } else {
          console.error("Unexpected FileReader result type:", reader.result);
          setError("خطا در خواندن فایل تصویر");
        }
      };
      reader.onerror = () => {
        console.error("FileReader error:", reader.error);
        setError("خطا در خواندن فایل تصویر.");
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setFile(null);
      setPostImage(undefined);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("لطفاً یک عکس برای پست انتخاب کنید.");
      return;
    }

    try {
      setCreatePostLoading(true);
      setError(null);

      const createPostDto: CreatePostDto = {
        caption: caption,
      };

      await postService.createPost(file, createPostDto);

      alert("پست با موفقیت ایجاد شد!");
      navigate("/profile");
    } catch (err: any) {
      console.error("Error creating new post:", err);
      setError(err?.response?.data?.message || "خطا در ایجاد پست");
    } finally {
      setCreatePostLoading(false);
    }
  };

  if (error) return <p className="error-text">{error}</p>;

  return (
    <PageContainer extraClassNames="new-post-page-container">
      <div className="new-post-container">
        <h1>پست جدید</h1>

        <form id="new-post-form" onSubmit={handleFormSubmit}>
          {postImage ? (
            <BlobImage
              blob={postImage}
              alt="New Post Image"
              className="post-media"
            />
          ) : null}
          <button
            type="button"
            id="edit-avatar-btn"
            onClick={handleChooseFileClick}
          >
            انتخاب عکس
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePostFileChange}
            style={{ display: "none" }}
          />

          <textarea
            className="text-box"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="توضیحات"
          ></textarea>

          <button disabled={createPostLoading} type="submit">
            {createPostLoading ? "درحال ایجاد پست جدید..." : "ایجاد"}
          </button>
        </form>
      </div>
    </PageContainer>
  );
};

export default NewPostPage;
