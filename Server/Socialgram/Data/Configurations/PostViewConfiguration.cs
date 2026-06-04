using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Socialgram.Entities;
using Socialgram.Entities.Interfaces;

namespace Socialgram.Data.Configurations
{
    public class PostViewConfiguration : IEntityTypeConfiguration<PostView>
    {
        public void Configure(EntityTypeBuilder<PostView> builder)
        {
            builder.HasKey(pl => new { pl.PostId, pl.UserId });

            builder.HasOne(pl => pl.Post)
                  .WithMany(p => p.PostViews)
                  .HasForeignKey(pl => pl.PostId)
                  .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pl => pl.User)
                  .WithMany(u => u.PostViews)
                  .HasForeignKey(pl => pl.UserId)
                  .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
