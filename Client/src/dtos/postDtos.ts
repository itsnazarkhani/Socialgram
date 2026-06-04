export interface CreatePostDto {
  caption?: string | null;
}

export interface UpdatePostCaptionDto {
  caption?: string | null;
}

export interface PostDto {
  id: string;
  caption?: string;
  viewCount: number;
  likeCount: number;
  commentsCount: number;
  mediaId: string;
  postOwnerId: string;
  postOwnerUserName: string;
  isYours: boolean;
  didYouLiked: boolean;
  postedAt: string;
}

export interface PostListItemDto {
  id: string;
  viewCount: number;
}

export interface CreatePostResponseDto {
  id: string;
}
