import styles from "./BlobAvatar.module.css";
import { useState, useEffect } from "react";
import { RxAvatar } from "react-icons/rx";
import type { ElementSize } from "../../../types/ElementSize";

type BlobAvatarProps = {
  blob?: Blob | undefined;
  isBigAvatar: boolean;
  handleClick?: () => void;
  extraClassNames?: string;
};

function BlobAvatar({
  blob,
  handleClick,
  extraClassNames,
  isBigAvatar = false,
}: BlobAvatarProps) {
  const [url, setUrl] = useState<string>("");

  const avatarSize: ElementSize = {
    width: isBigAvatar ? "120px" : "45px",
    height: isBigAvatar ? "120px" : "45px",
  };

  const avatarStyle = {
    width: avatarSize.width,
    height: avatarSize.height,
  };

  useEffect(() => {
    if (blob && blob instanceof Blob) {
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [blob]);

  const handleAvatarClick = () => {
    if (handleClick) handleClick();
  };

  if (!url)
    return (
      <div
        className={`${extraClassNames} ${styles.avatar}`}
        style={avatarStyle}
        onClick={handleAvatarClick}
      >
        <RxAvatar />
      </div>
    );
  return (
    <img
      src={url}
      alt="User Avatar"
      className={`${extraClassNames} ${styles.avatar}`}
      style={avatarStyle}
      onClick={handleAvatarClick}
    />
  );
}

export default BlobAvatar;
