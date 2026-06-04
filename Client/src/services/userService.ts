import api from "../api";
import type { PostListItemDto } from "../dtos/postDtos";
import type { UpdateProfileDto, UserProfileDto, UsersListItemDto, UserDto } from "../dtos/userDtos";



export const userService = {
  updateProfile: (data: UpdateProfileDto) =>
    api.put<UserProfileDto>("/users/profile", data).then((res) => res.data),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api
      .put<{ id: string }>("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  deleteAvatar: () => api.delete("/users/avatar"),

  getAvatar: (userId: string) =>
    api
      .get<Blob>(`/users/${userId}/avatar`, {
        responseType: "blob",
      })
      .then((res) => res.data),

  checkUsernameAvailable: (username: string) =>
    api.get<boolean>(`/users/username/${username}/is-available`).then((res) => res.data),

  searchUsers: (username: string) =>
    api
      .get<UsersListItemDto[]>("/users", {
        params: { username },
      })
      .then((res) => res.data),

  followUser: (id: string) => api.post(`/users/${id}/follow`),

  unfollowUser: (id: string) => api.delete(`/users/${id}/follow`),

  getUser: (id: string) =>
    api.get<UserDto>(`/users/${id}`).then((res) => res.data),

  getUserPosts: (id: string) =>
    api.get<PostListItemDto[]>(`/users/${id}/posts`).then((res) => res.data),

  getMyId: async () => {
    const res = await api.get("/users/my-id");
    return res.data;
  },

  getFollowers: (userId: string) =>
    api.get<UsersListItemDto[]>(`/users/${userId}/followers`).then((res) => res.data),

   getFollowings: (userId: string) =>
    api.get<UsersListItemDto[]>(`/users/${userId}/followings`).then((res) => res.data),
};
