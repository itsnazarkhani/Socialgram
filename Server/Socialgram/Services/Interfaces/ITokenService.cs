using Socialgram.Domain.Entities;

namespace Socialgram.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        DateTime GetRefreshTokenExpiresAt();
    }
}
