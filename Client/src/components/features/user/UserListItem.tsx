import type { JSX } from "react";
import styles from "./UserListItem.module.css";

type UserListItemProps = {
  userId: string;
  handleUserListItemClick: () => void;
  avatar: JSX.Element;
  userName?: string;
  displayName?: string;
  extraClassNames?: string;
};

const UserListItem = ({
  userId,
  handleUserListItemClick,
  avatar,
  userName,
  displayName,
  extraClassNames,
}: UserListItemProps) => {
  return (
    <div key={userId} className={`${styles.item} ${extraClassNames}`} onClick={handleUserListItemClick}>
      {avatar}
      <div className={styles.userInfo}>
        <span className={styles.username}> {userName || "کاربر ناشناس"}</span>
        <div className={styles.displayName}>{displayName || "بی‌نام"}</div>
      </div>
    </div>
  );
};

export default UserListItem;
