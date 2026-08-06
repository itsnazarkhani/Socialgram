namespace Socialgram.Application.DTOs
{
    public record class RegisterDto(string UserName, string Password);

    public record class LoginDto(string UserName, string Password);

    public record class ResponseTokenDto(string AccessToken,
                                         string RefreshToken,
                                         DateTime RefreshTokenExpiresAt);

    public record class RefreshTokenDto(string RefreshToken);
}
