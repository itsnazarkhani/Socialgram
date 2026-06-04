export interface UsersListItemDto {
  id: string;
  displayName: string;
  userName: string;
}

export interface UpdateProfileDto {
  displayName?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
}

export interface UserProfileDto {
  id: string;
  userName: string;
  displayName?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
}

export interface UserDto {
  id: string;
  userName: string;
  displayName?: string | null;
  bio?: string | null;
  avatarId: string;
  isYou: boolean;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}
