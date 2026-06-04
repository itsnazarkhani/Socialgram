export interface CommentListItemDto {
  id: string;
  userId: string;
  userName: string;
  text: string;
  isYours: boolean;
  postedAt: string;
}

export interface CreateCommentDto {
  text: string;
}