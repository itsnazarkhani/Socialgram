import BlobAvatar from "../Image/BlobAvatar";
import styles from "./PostHeader.module.css";
import { BsThreeDots } from "react-icons/bs";
import type { ContextMenuItemData } from "../../../interfaces/menuInterfaces";
import ContextMenu from "../ContextMenu/ContextMenu";
import type { Position2D } from "../../../types/Position2D";
import { useMouse } from "@uidotdev/usehooks";
import { useState, type Ref } from "react";

type PostHeaderProps = {
  avatarBlob?: Blob | undefined;
  onUserInfoClick: () => void;
  username?: string;
  options: ContextMenuItemData[];
};

const PostHeader = ({
  avatarBlob,
  onUserInfoClick,
  username,
  options,
}: PostHeaderProps) => {
  const [mouse, ref] = useMouse();
  const [shouldDisplayContextMenu, setShouldDisplayContextMenu] =
    useState<boolean>(false);

  const toggleContextDisplay = () => {
    setShouldDisplayContextMenu(!shouldDisplayContextMenu);
  };

  return (
    <header className={styles.header}>
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
          onClick={toggleContextDisplay}
          ref={ref as Ref<HTMLButtonElement>}
          className={styles.optionsBtn}
        >
          <BsThreeDots />
        </button>
      )}

      <ContextMenu
        items={options}
        position={
          {
            top: `${mouse.elementPositionY + 20}px`,
            left: `${mouse.elementPositionX}px`,
          } satisfies Position2D
        }
        onState={shouldDisplayContextMenu}
      />
    </header>
  );
};

export default PostHeader;
