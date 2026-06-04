namespace Socialgram.DTOs
{
    public record class UsersListItemDto(Guid Id,
                                         string DisplayName,
                                         string UserName);

    public record class UpdateProfileDto(string? DisplayName,
                                         string? Bio,
                                         string? PhoneNumber);

    public record class UserProfileDto(Guid Id,
                                       string UserName,
                                       string? DisplayName,
                                       string? Bio,
                                       string? PhoneNumber);

    public record class UserDto(Guid Id,
                                string UserName,
                                string? DisplayName,
                                string? Bio,
                                Guid AvatarId,
                                bool IsYou,
                                bool IsFollowing,
                                int FollowerCount = 0,
                                int FollowingCount = 0);              
}
