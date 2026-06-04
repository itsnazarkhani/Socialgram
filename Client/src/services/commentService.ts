import api from "../api"
import type { CommentListItemDto } from "../dtos/commentDtos";

export const commentService = {
    getCommentById: (id: string) =>
        api.get<CommentListItemDto>(`/comments/${id}`).then((res) => res.data),
};
