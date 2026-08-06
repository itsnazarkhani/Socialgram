using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Socialgram.Data;
using Socialgram.Application.DTOs;
using Socialgram.Domain.Entities;
using Socialgram.Application.Interfaces;

namespace Socialgram.Services
{
    public class AuthService(
        ITokenService tokenService,
        SocialgramDbContext context,
        IPasswordHasher<User> passwordHasher)
    {
        private readonly SocialgramDbContext _context = context;
        private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;
        private readonly ITokenService _tokenService = tokenService;

        public async Task<User> RegisterAsync(string username, string password)
        {
            var user = new User { Id = Guid.NewGuid(), UserName = username.Trim().ToLower() };
            user.PasswordHash = _passwordHasher.HashPassword(user, password);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<ResponseTokenDto?> LoginAsync(string username, string password)
        {
            var user = _context.Users.Include(u => u.RefreshTokens).FirstOrDefault(u => u.UserName == username);
            if (user == null)
                return null;

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash!, password);
            if (verificationResult != PasswordVerificationResult.Success)
                return null;

            var accessToken = _tokenService.GenerateAccessToken(user);

            var refreshTokenString = _tokenService.GenerateRefreshToken();
            var refreshTokenExpiresAt = _tokenService.GetRefreshTokenExpiresAt();

            var newRefreshToken = new RefreshToken(refreshTokenString, user.Id, refreshTokenExpiresAt, "Login");

            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            return new ResponseTokenDto(accessToken, refreshTokenString, refreshTokenExpiresAt);
        }

        public async Task<ResponseTokenDto?> RefreshAsync(string refreshToken)
        {
            var storedToken = await _context.RefreshTokens.Include(rt => rt.User)
                                                          .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken == null)
                return null;

            if (storedToken.ExpiresAt < DateTime.UtcNow)
                return null;

            if (storedToken.IsRevoked) return null;

            var user = storedToken.User;
            if (user == null)
                return null;

            var newAccessToken = _tokenService.GenerateAccessToken(user);

            var newRefreshTokenString = _tokenService.GenerateRefreshToken();
            var newRefreshTokenExpiresAt = _tokenService.GetRefreshTokenExpiresAt();

            storedToken.IsRevoked = true;

            var newRefreshToken = new RefreshToken(newRefreshTokenString,
                                                   user.Id,
                                                   newRefreshTokenExpiresAt,
                                                   "Refresh");
            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            return new ResponseTokenDto(newAccessToken,
                                        newRefreshTokenString,
                                        newRefreshTokenExpiresAt);
        }
    }
}
