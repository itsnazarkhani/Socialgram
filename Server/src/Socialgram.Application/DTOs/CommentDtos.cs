namespace Socialgram.Application.DTOs
{
    public record class CommentListItemDto(Guid Id,
                                           Guid UserId,
                                           string UserName,
                                           string Text,
                                           bool IsYours,
                                           DateTime PostedAt);

    public record class CreateCommentDto(string Text);
}
