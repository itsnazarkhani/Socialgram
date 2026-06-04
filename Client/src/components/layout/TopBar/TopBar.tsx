import { useEffect, useRef, useState } from 'react'
import styles from './TopBar.module.css'
import { useNavigate } from 'react-router-dom';
import type { UsersListItemDto } from '../../../dtos/userDtos';
import { userService } from '../../../services/userService';
import BlobAvatar from '../../ui/Image/BlobAvatar';
import UserListItem from '../../features/user/UserListItem';

interface UsersListWithAvatarBlob extends UsersListItemDto {
    avatarBlob?: Blob | undefined;
}

const TopBar: React.FC = () => {
    const navigate = useNavigate();

    const [togglePopup, setTogglePopup] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [usersList, setUsersList] = useState<UsersListWithAvatarBlob[]>([]);

    const closePopupTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (!search) {
            setUsersList([]);
            return;
        }

        const fetchUsers = async () => {
            try {
                const usersList: UsersListItemDto[] = await userService.searchUsers(search);
                const usersWithAvatarBlob: UsersListWithAvatarBlob[] = await Promise.all(
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
                        return ({ ...user, avatarBlob });
                    })

                );
                setUsersList(usersWithAvatarBlob);
            } catch (err) {
                console.error("Error while fetching users list:", err);
                setUsersList([]);
            }
        }

        fetchUsers();

    }, [search])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value) {
            setTogglePopup(true);
        } else {
            setTogglePopup(false);
        }
    }

    const handleSearchBarFocus = () => {
        if (search)
            setTogglePopup(true);
    }

    const handleBlur = () => {
        closePopupTimeout.current = setTimeout(() => {
            setTogglePopup(false);
        }, 100);
    }

    const handleUserListItemClick = (userId: string) => {
        if (closePopupTimeout.current != null) {
            clearTimeout(closePopupTimeout.current);
        }
        navigate(`/user/${userId}`);
        setTogglePopup(false);
        setSearch('');
        setUsersList([]);
    }

    const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    return (
        <div className={styles.topBar}>
            <input type="text" value={search} onChange={handleChange} onBlur={handleBlur} onFocus={handleSearchBarFocus} placeholder="Search" />
            {togglePopup ?
                <div
                    className={styles.searchPopup}
                    onClick={handlePopupClick}>
                    {usersList.map((user) => {
                        const avatar =
                            <BlobAvatar
                                blob={user.avatarBlob}
                                isBigAvatar={false}
                                handleClick={{}} />;

                        return (
                            <UserListItem
                                key={user.id}
                                userId={user.id}
                                userName={user.userName}
                                displayName={user.displayName}
                                avatar={avatar}
                                handleUserListItemClick={() => handleUserListItemClick(user.id)} />
                        )
                    })}
                </div> : null
            }
        </div >
    );
}

export default TopBar;