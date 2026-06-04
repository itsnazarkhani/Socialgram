import type { CommentListItemDto } from "../dtos/commentDtos";

export interface CommentData extends CommentListItemDto {
    avatarBlob?: Blob | undefined;
}