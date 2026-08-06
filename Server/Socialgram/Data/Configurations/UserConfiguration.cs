using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Socialgram.Domain.Entities;

namespace Socialgram.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(u => u.RowVersion)
                            .IsRowVersion();

            builder.HasIndex(u => u.UserName)
                .IsUnique();

            builder.HasMany(u => u.PostLikes)
                .WithOne(pl => pl.User)
                .HasForeignKey(pl => pl.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
