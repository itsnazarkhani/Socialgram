using Socialgram.Domain.Entities;

namespace Socialgram.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        DateTime GetRefreshTokenExpiresAt();
    }
}
