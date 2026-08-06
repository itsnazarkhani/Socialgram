using Microsoft.EntityFrameworkCore;
using Socialgram.Domain.Entities;

namespace Socialgram.Data
{
    public class SocialgramDbContext : DbContext
    {
        public SocialgramDbContext(DbContextOptions options) : base(options)
        {
        }

        protected SocialgramDbContext()
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<MediaFile> MediaFiles { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<PostView> PostViews { get; set; }
        public DbSet<UserFollow> UserFollows { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Avatar> Avatars { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(SocialgramDbContext).Assembly);
        }
    }
}
