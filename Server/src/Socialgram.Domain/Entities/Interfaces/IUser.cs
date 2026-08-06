using System.ComponentModel.DataAnnotations;

namespace Socialgram.Domain.Entities.Interfaces;

public interface IUser
{
    string? UserName { get; set; }
    string? PhoneNumber { get; set; }
    string? DisplayName { get; set; }
    string? PasswordHash { get; set; }
}
