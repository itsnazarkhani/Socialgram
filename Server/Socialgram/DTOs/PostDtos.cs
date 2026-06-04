
namespace Socialgram.DTOs
{
    public record class CreatePostDto(string? Caption);

    public record class PostDto(Guid Id,
                                string? Caption,
                                int ViewCount,
                                int LikeCount,
                                int CommentsCount,
                                Guid MediaId,
                                Guid PostOwnerId,
                                string PostOwnerUserName,
                                bool IsYours,
                                bool DidYouLiked,
                                DateTime PostedAt);

    public record class UpdatePostCaptionDto(string? Caption);

    public record class PostListItemDto(Guid Id,
                                        int ViewCount);
}
