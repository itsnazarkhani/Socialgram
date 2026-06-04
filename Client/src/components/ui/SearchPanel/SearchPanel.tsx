import { useState, useRef, useEffect, type Ref } from "react";
import { useNavigate } from "react-router-dom";
import type { UsersListItemDto } from "../../../dtos/userDtos";
import type { UsersListWithAvatarBlob } from "../../../interfaces/userInterfaces";
import { userService } from "../../../services/userService";
import UserListItem from "../../features/user/UserListItem";
import BlobAvatar from "../Image/BlobAvatar";
import styles from "./SearchPanel.module.css";
import { useClickAway } from "@uidotdev/usehooks";
import { FaX } from "react-icons/fa6";

type SearchPanelProps = {
  togglePanel: boolean;
  setTogglePanel: (value: boolean) => void;
};

const SearchPanel = ({ togglePanel, setTogglePanel }: SearchPanelProps) => {
  const navigate = useNavigate();
  const ref = useClickAway(() => {
    setTogglePanel(false);
  });

  const [search, setSearch] = useState<string>("");
  const [usersList, setUsersList] = useState<UsersListWithAvatarBlob[]>([]);

  const closePopupTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!search) {
      setUsersList([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersList: UsersListItemDto[] =
          await userService.searchUsers(search);
        const usersWithAvatarBlob: UsersListWithAvatarBlob[] =
          await Promise.all(
            usersList.map(async (user: UsersListItemDto) => {
              let avatarBlob: Blob | undefined = undefined;
              try {
                avatarBlob = await userService.getAvatar(user.id);
              } catch (e: any) {
                if (e?.response?.status === 404) {
                  avatarBlob = undefined;
                } else {
                  throw e;
                }
              }
              return { ...user, avatarBlob };
            }),
          );
        setUsersList(usersWithAvatarBlob);
      } catch (err) {
        console.error("Error while fetching users list:", err);
        setUsersList([]);
      }
    };

    fetchUsers();
  }, [search]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    if (event.target.value) {
      setTogglePanel(true);
    } else {
      setTogglePanel(false);
    }
  };

  const handleUserListItemClick = (userId: string) => {
    if (closePopupTimeout.current != null) {
      clearTimeout(closePopupTimeout.current);
    }
    navigate(`/user/${userId}`);
    setTogglePanel(false);
    setSearch("");
    setUsersList([]);
  };

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      className={`${styles.searchPanel} ${togglePanel ? styles.visible : ""}`}
    >
      <div className={styles.actionBtnsContainer}>
        <button
          className={styles.closeBtn}
          onClick={() => setTogglePanel(false)}
        >
          <FaX />
        </button>
      </div>
      <input
        placeholder="جستجو"
        type="text"
        value={search}
        onChange={handleChange}
      />

      {usersList.map((user) => {
        const avatar = (
          <BlobAvatar blob={user.avatarBlob} isBigAvatar={false} />
        );

        return (
          <UserListItem
            key={user.id}
            userId={user.id}
            userName={user.userName}
            displayName={user.displayName}
            avatar={avatar}
            extraClassNames={styles.radiusBorder}
            handleUserListItemClick={() => handleUserListItemClick(user.id)}
          />
        );
      })}
    </div>
  );
};

export default SearchPanel;
