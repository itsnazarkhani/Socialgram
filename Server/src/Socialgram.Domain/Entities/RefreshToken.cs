using Socialgram.Domain.Entities.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Socialgram.Domain.Entities;

public class RefreshToken : IEntity<Guid>
{
    public Guid Id { get; set; }
    public string Token { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedByIp { get; set; }


    private RefreshToken() { }

    public RefreshToken(string token, Guid userId, DateTime expiresAt, string? createdByIp)
    {
        Token = token ?? throw new ArgumentNullException(nameof(token));
        UserId = userId;
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
        CreatedByIp = createdByIp;
    }
}
