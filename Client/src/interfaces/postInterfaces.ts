import type { PostDto, PostListItemDto } from "../dtos/postDtos";

export interface PostCounters {
    [postId: string]: {
        viewCount: number;
        likeCount: number;
    };
}

export interface PostWithDisplayData extends PostDto {
    avatarBlob?: Blob | undefined;
    mediaBlob?: Blob | undefined;
}

export interface PostsWithMediaBlob extends PostListItemDto {
    mediaBlob?: Blob | undefined;
}