namespace Socialgram.Domain.Entities;

public class PostView
{
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid PostId { get; set; }
    public Post? Post { get; set; }
}
