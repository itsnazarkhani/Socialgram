import styles from "./PostHeader.module.css";
import { BsThreeDots } from "react-icons/bs";
import { useRef, useState } from "react";
import type { ContextMenuItemData } from "../../../../interfaces/menuInterfaces";
import BlobAvatar from "../../../ui/Image/BlobAvatar";
import { OverlayPanel } from "primereact/overlaypanel";
import OverlayMenuItem from "../../../ui/OverlayMenuItem/OverlayMenuItem";

type PostHeaderProps = {
  avatarBlob?: Blob | undefined;
  onUserInfoClick: () => void;
  username?: string;
  options: ContextMenuItemData[];
  extraClassNames?: string;
};

const PostHeader = ({
  avatarBlob,
  onUserInfoClick,
  username,
  options,
  extraClassNames,
}: PostHeaderProps) => {
  useState<boolean>(false);
  const op = useRef<OverlayPanel>(null);

  return (
    <header className={`${styles.header} ${extraClassNames}`}>
      <div className={styles.infoContainer}>
        <BlobAvatar
          blob={avatarBlob}
          isBigAvatar={false}
          handleClick={onUserInfoClick}
        />

        <span className={styles.username} onClick={onUserInfoClick}>
          {username || "کاربر ناشناس"}
        </span>
      </div>

      {options.length > 0 && (
        <button
          onClick={(e) => op.current?.toggle(e)}
          className={styles.optionsBtn}
        >
          <BsThreeDots />
        </button>
      )}

      <OverlayPanel ref={op} className={styles.menu}>
        {options.map((option) => (
          <OverlayMenuItem
            key={option.label}
            action={() => {
              option.action();
              op.current?.hide();
            }}
            label={option.label}
            forColor={option.forColor}
            icon={option.icon}
          />
        ))}
      </OverlayPanel>
    </header>
  );
};

export default PostHeader;
