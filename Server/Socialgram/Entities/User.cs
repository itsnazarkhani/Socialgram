using Microsoft.EntityFrameworkCore;
using Socialgram.Entities.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Socialgram.Entities
{
    public class User : IEntity<Guid>, IUser
    {
        public Guid Id { get; set; }
        [Required]
        public string? UserName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? DisplayName { get; set; }
        [Required]
        public string? PasswordHash { get; set; }
        public string? Bio { get; set; }

        [Timestamp]
        public byte[]? RowVersion { get; set; }

        public Avatar? Avatar { get; set; }

        [InverseProperty(nameof(Post.User))]
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

        public virtual ICollection<PostLike> PostLikes { get; set; } = new List<PostLike>();
        public virtual ICollection<PostView> PostViews { get; set; } = new List<PostView>();

        public virtual ICollection<UserFollow> Following { get; set; } = new List<UserFollow>();
        public virtual ICollection<UserFollow> Followers { get; set; } = new List<UserFollow>();

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
