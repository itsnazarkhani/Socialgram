import type { JSX } from "react";
import UserListItem from "./UserListItem";
import type { UsersListWithAvatarBlob } from "../../../interfaces/userInterfaces";
import BlobAvatar from "../../ui/Image/BlobAvatar";

type UsersListProps = {
  usersList: UsersListWithAvatarBlob[];
  handleListItemClick: (userId: string) => void;
};

const UsersList = (props: UsersListProps) => {
  const usersListWithAvatarElement = props.usersList.map((user) => {
    const userAvatar: JSX.Element = (
      <BlobAvatar blob={user?.avatarBlob} key={user.id} isBigAvatar={false} />
    );
    return (
      <UserListItem
        key={user.id}
        userId={user.id}
        userName={user.userName}
        displayName={user.displayName}
        avatar={userAvatar}
        handleUserListItemClick={() => props.handleListItemClick(user.id)}
      />
    );
  });

  return usersListWithAvatarElement;
};

export default UsersList;
