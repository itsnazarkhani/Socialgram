import type { JSX } from "react";
import "./UserListItem.css"

type UserListItemProps = {
    userId: string,
    handleUserListItemClick: () => void;
    avatar: JSX.Element;
    userName?: string;
    displayName?: string;
}

const UserListItem = ({
    userId,
    handleUserListItemClick,
    avatar,
    userName,
    displayName
}: UserListItemProps) => {
    return (
        <div key={userId} className='user-list-item'
            onClick={handleUserListItemClick}>
            {avatar}
            <div className='user-naming-detail-container'>
                <span className="username-search-item" > {userName || "کاربر ناشناس"}</span>
                <div className="display-name-search-item">{displayName || "بی‌نام"}</div>
            </div>
        </div>
    );
}

export default UserListItem;