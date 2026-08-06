using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Socialgram.Domain.Entities;

namespace Socialgram.Infrastructure.Data.Configurations
{
    public class PostLikeConfiguration : IEntityTypeConfiguration<PostLike
        >
    {
        public void Configure(EntityTypeBuilder<PostLike> builder)
        {
            builder.HasKey(pl => new { pl.PostId, pl.UserId });

            builder.HasOne(pl => pl.Post)
                  .WithMany(p => p.PostLikes)
                  .HasForeignKey(pl => pl.PostId)
                  .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(pl => pl.User)
                  .WithMany(u => u.PostLikes)
                  .HasForeignKey(pl => pl.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
