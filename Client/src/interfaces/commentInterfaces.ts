import type { CommentListItemDto } from "../dtos/commentDtos";

export interface Comment extends CommentListItemDto {
    avatarBlob?: Blob | undefined;
}