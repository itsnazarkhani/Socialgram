using Socialgram.Application.DTOs;
using Socialgram.Domain.Entities;

namespace Socialgram.Application.Mapping
{
    public static class UsersMapping
    {
        public static UsersListItemDto ToUsersListItemDto(this User user) => new(user.Id,
                                                                                 user?.DisplayName ?? "بی‌نام",
                                                                                 user?.UserName ?? "Unknown");

        public static void UpdateUserProfile(this User user, UpdateProfileDto dto)
        {
            user.DisplayName = dto.DisplayName;
            user.Bio = dto.Bio;
            user.PhoneNumber = dto.PhoneNumber;
        }

        public static UserProfileDto ToUserProfileDto(this User user) =>
            new UserProfileDto(user.Id,
                               user.UserName ?? "Unknown",
                               user.DisplayName,
                               user.Bio,
                               user.PhoneNumber);
    }
}
