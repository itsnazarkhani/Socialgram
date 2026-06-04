import api from "../api";
import type { CommentListItemDto, CreateCommentDto } from "../dtos/commentDtos";
import type { CreatePostDto, CreatePostResponseDto, PostDto, PostListItemDto, UpdatePostCaptionDto } from "../dtos/postDtos";
import type { UsersListItemDto } from "../dtos/userDtos";


export const postService = {
    createPost: (file: File, dto: CreatePostDto) => {
        const formData = new FormData();
        formData.append("file", file);

        if (dto.caption !== undefined && dto.caption !== null) {
            formData.append("Caption", dto.caption);
        }

        return api
            .post<CreatePostResponseDto>("/posts", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => res.data);
    },

    getPostById: (id: string) =>
        api.get<PostDto>(`/posts/${id}`).then((res) => res.data),

    deletePost: (id: string) =>
        api.delete(`/posts/${id}`).then((res) => res.data),

    getPosts: () =>
        api.get<PostListItemDto[]>("/posts").then((res) => res.data),

    updatePostCaption: (id: string, dto: UpdatePostCaptionDto) =>
        api.patch<any>(`/posts/${id}/caption`, dto).then((res) => res.data),

    likePost: (id: string) =>
        api.post(`/posts/${id}/like`).then((res) => res.data),

    unlikePost: (id: string) =>
        api.delete(`/posts/${id}/like`).then((res) => res.data),

    getListOfWhoLikedThePost: (postId: string) =>
        api.get<UsersListItemDto[]>(`/posts/${postId}/likes`).then((res) => res.data),

    getComments: (postId: string) =>
        api.get<CommentListItemDto[]>(`/posts/${postId}/comments`).then((res) => res.data),

    postAComment: (postId: string, dto: CreateCommentDto) =>
        api.post(`/posts/${postId}/comments`, dto).then((res) => res.data),

    deleteMyComment: (postId: string, commentId: string) =>
        api.delete(`/posts/${postId}/comments/${commentId}`).then((res) => res.data),

    getMedia: (postId: string) =>
        api.get(`/posts/${postId}/media`, { responseType: "blob" }).then((res) => res.data),

    getFollowingsPosts: () =>
        api.get<PostDto[]>("/posts/followings").then((res) => res.data),

    markAsViewed: async (postId: string) => {
        try {
            const response = await api.post(`/posts/${postId}/view`);
            return response.data;
        } catch (error) {
            console.error("خطا در ارسال دیده‌شدن پست:", error);
            return { incrementView: false };
        }
    }
};
