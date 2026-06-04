using Socialgram.DTOs;
using Socialgram.Entities;

namespace Socialgram.Mapping
{
    public static class PostsMapping
    {
        public static PostListItemDto ToListItemDto(this Post post, Guid mediaId) =>
            new PostListItemDto(post.Id, mediaId);
    }
}
