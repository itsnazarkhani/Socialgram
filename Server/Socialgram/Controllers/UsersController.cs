using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Socialgram.Data;
using Socialgram.DTOs;
using Socialgram.Domain.Entities;
using Socialgram.Mapping;
using Socialgram.Services;
using System.Security.Claims;

namespace Socialgram.Controllers
{
    [Authorize]
    [Route("api/[Controller]")]
    [ApiController]
    public class UsersController(
        SocialgramDbContext context,
        AvatarStorageService avatarStorageService) : ControllerBase
    {
        private readonly SocialgramDbContext _context = context;
        private readonly AvatarStorageService _avatarStorageService = avatarStorageService;

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var oldUser = await _context.Users.FindAsync(userId);
            if (oldUser == null) return NotFound();
            oldUser.UpdateUserProfile(dto);
            await _context.SaveChangesAsync();

            return Ok(oldUser.ToUserProfileDto());
        }

        [HttpGet("my-id")]
        public async Task<IActionResult> WhatIsMyId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            return Ok(new { Id = userId });
        }

        [HttpPut("avatar")]
        public async Task<IActionResult> UpdateAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("فایل ارسال نشده است.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var avatarId = await _avatarStorageService.UpdateAvatarAsync(file, userId);

            return Ok(new { Id = avatarId });
        }

        [HttpDelete("avatar")]
        public async Task<IActionResult> DeleteAvatar()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var avatar = await _context.Avatars
                .FirstOrDefaultAsync(a => a.UserId == userId);
            await _avatarStorageService.DeleteAvatar(avatar);
            return Ok();
        }

        [HttpGet("{userId:guid}/avatar")]
        public async Task<IActionResult> GetAvatar(Guid userId)
        {
            var avatar = await _context.Avatars
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (avatar == null)
                return NotFound();

            var stream = await _avatarStorageService.GetAvatarByIdAsync(avatar);

            return File(stream, avatar.MediaType, Path.GetFileName(avatar.FilePath));
        }

        [AllowAnonymous]
        [HttpGet("username/{username}/is-available")]
        public async Task<IActionResult> IsUserNameAvailable(string username)
        {
            bool doesUserNameExists = await _context.Users.AnyAsync(u => u.UserName == username);

            return Ok(!doesUserNameExists);
        }

        [HttpGet]
        public async Task<IActionResult> SearchWithUsername([FromQuery] string username)
        {
            var users = await _context.Users
                .Where(u => u.UserName!.StartsWith(username))
                .Select(u => u.ToUsersListItemDto())
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("{id:guid}/follow")]
        public async Task<IActionResult> FollowUser(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var userToFollowExists = await _context.Users
                .AnyAsync(u => u.Id == id);
            if (!userToFollowExists || id == userId) return BadRequest();

            var userFollowRecord = await _context.UserFollows
                .FirstOrDefaultAsync(uf => uf.FollowingId == id && uf.FollowerId == userId);
            if (userFollowRecord == null)
            {
                var userFollow = new UserFollow()
                {
                    FollowerId = userId,
                    FollowingId = id
                };
                _context.UserFollows.Add(userFollow);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpDelete("{id:guid}/follow")]
        public async Task<IActionResult> UnFollowUser(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var userToFollowExists = await _context.Users
                .AnyAsync(u => u.Id == id);
            if (!userToFollowExists) return BadRequest();

            var userFollowRecord = await _context.UserFollows
                .FirstOrDefaultAsync(uf => uf.FollowingId == id && uf.FollowerId == userId);
            if (userFollowRecord != null)
            {
                _context.UserFollows.Remove(userFollowRecord);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var user = await _context.Users
                .Include(u => u.Avatar)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();

            var dto = new UserDto(
                user.Id,
                user.UserName!,
                user.DisplayName,
                user.Bio,
                user.Avatar?.Id ?? Guid.Empty,
                user.Id == userId,
                user.Followers.Any(f => f.FollowerId == userId),
                user.Followers.Count,
                user.Following.Count);

            return Ok(dto);
        }

        [HttpGet("{id:guid}/posts")]
        public async Task<IActionResult> GetUserPosts(Guid id)
        {
            var posts = _context.Posts
                .Select(p => new
                {
                    p.Id,
                    ViewCount = p.PostViews.Count,
                    p.UserId
                })
                .Where(p => p.UserId == id)
                .AsEnumerable()
                .Select(p => new PostListItemDto(p.Id, p.ViewCount))
                .ToList();

            return Ok(posts);
        }

        [HttpGet("{userId:Guid}/followers")]
        public async Task<IActionResult> GetUserFollowers(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Followers)
                    .ThenInclude(uf => uf.Follower)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return BadRequest("کاربر یافت نشد. یک شناسه معتبر وارد کنید.");

            var followers = user.Followers
                .Select(f => f.Follower.ToUsersListItemDto());

            return Ok(followers);
        }

        [HttpGet("{userId:Guid}/followings")]
        public async Task<IActionResult> GetUserFollowings(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Following)
                    .ThenInclude(uf => uf.Following)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return BadRequest("کاربر یافت نشد. یک شناسه معتبر وارد کنید.");

            var followings = user.Following
                .Select(f => f.Following.ToUsersListItemDto());

            return Ok(followings);
        }
    }
}
