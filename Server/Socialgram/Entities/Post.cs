using Socialgram.Entities.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Socialgram.Entities
{
    public class Post : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string? Caption { get; set; }
        public DateTime CreatedAt { get; set; }

        [Timestamp]
        public byte[]? RowVersion { get; set; }

        // Post owner relation
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        // Collection of people who liked the post
        public virtual ICollection<PostLike> PostLikes { get; set; } = new List<PostLike>();
        public virtual ICollection<PostView> PostViews { get; set; } = new List<PostView>();

        public MediaFile? MediaFile { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
