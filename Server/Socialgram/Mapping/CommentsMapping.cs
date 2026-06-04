using Socialgram.DTOs;
using Socialgram.Entities;

namespace Socialgram.Mapping
{
    public static class CommentsMapping
    {
        public static Comment ToEntity(this CreateCommentDto dto, Guid userId, Guid postId) =>
            new Comment()
            {
                UserId = userId,
                PostId = postId,
                Text = dto.Text
            };
    }
}
