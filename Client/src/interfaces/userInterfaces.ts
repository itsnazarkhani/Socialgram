import type { PostListItemDto } from "../dtos/postDtos";
import type { UserDto, UsersListItemDto } from "../dtos/userDtos";

export interface UserWithAvatarBlob extends UserDto {
    avatarBlob?: Blob | undefined;
}

export interface PostWithMediaBlob extends PostListItemDto {
    mediaBlob?: Blob;
}

export interface UsersListWithAvatarBlob extends UsersListItemDto {
    avatarBlob?: Blob | undefined;
}