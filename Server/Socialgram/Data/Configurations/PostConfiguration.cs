using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Socialgram.Domain.Entities;

namespace Socialgram.Data.Configurations
{
    public class PostConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            builder.Property(p => p.RowVersion)
                     .IsRowVersion();

            builder.HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.PostLikes)
                .WithOne(pl => pl.Post)
                .HasForeignKey(pl => pl.PostId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.MediaFile)
                .WithOne(m => m.Post)
                .HasForeignKey<MediaFile>(m => m.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
