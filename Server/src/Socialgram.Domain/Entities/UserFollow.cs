using Socialgram.Domain.Entities.Interfaces;

namespace Socialgram.Domain.Entities;

public class UserFollow
{
    public Guid FollowerId { get; set; }
    public User Follower { get; set; } = null!;

    public Guid FollowingId { get; set; }
    public User Following { get; set; } = null!;
}
