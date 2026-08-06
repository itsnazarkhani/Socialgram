using Socialgram.Domain.Entities.Interfaces;

namespace Socialgram.Domain.Entities;

public class Avatar : IEntity<Guid>
{
    public Guid Id { get; set; }
    public string FilePath { get; set; } = string.Empty;
    // MIME Type
    public string MediaType { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User? User { get; set; }
}
