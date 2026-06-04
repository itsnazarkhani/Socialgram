using Socialgram.DTOs;
using Socialgram.Entities;

namespace Socialgram.Mapping
{
    public static class PostsMapping
    {
        public static PostListItemDto ToListItemDto(this Post post, int viewCount) =>
            new PostListItemDto(post.Id, viewCount);
    }
}
