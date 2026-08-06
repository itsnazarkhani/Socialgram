using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Socialgram.Data;
using Socialgram.Application.DTOs;
using Socialgram.Domain.Entities;
using Socialgram.Application.Mapping;
using Socialgram.Services;
using Socialgram.Application.Interfaces;
using System.Security.Claims;

namespace Socialgram.Controllers
{
    [Authorize]
    [Route("api/[Controller]")]
    [ApiController]
    public class PostsController(SocialgramDbContext context,
        PostService postService,
        IMediaStorageService mediaStorageService) : ControllerBase
    {
        private readonly SocialgramDbContext _context = context;
        private readonly PostService _postService = postService;
        private readonly IMediaStorageService _mediaStorageService = mediaStorageService;

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] IFormFile file, [FromForm] CreatePostDto dto)
        {
            if (file == null || file.Length == 0)
                return BadRequest("فایل ارسال نشده است.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");
            Guid postId;
            try
            {
                postId = await _postService.AddPostAsync(dto, file, userId);
            }
            catch (Exception)
            {
                return BadRequest();
            }

            return Ok(new { Id = postId });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPostById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var postData = await _context.Posts
                .Select(p => new
                {
                    p.Id,
                    p.Caption,
                    PostViewsCount = p.PostViews.Count(),
                    PostLikesCount = p.PostLikes.Count(),
                    CommentsCount = p.Comments.Count(),
                    MediaFileId = p.MediaFile!.Id,
                    p.UserId,
                    p.User!.UserName,
                    p.CreatedAt,
                })
                .FirstOrDefaultAsync(p => p.Id == id);

            if (postData == null) return NotFound();

            bool alreadyViewed = await _context.PostViews
               .AnyAsync(pl => pl.PostId == id && pl.UserId == userId);
            if (!alreadyViewed)
            {
                try
                {
                    var newView = new PostView { PostId = id, UserId = userId };
                    _context.PostViews.Add(newView);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                }
            }
            bool alreadyLiked = await _context.PostLikes
                .AnyAsync(pl => pl.PostId == postData.Id && pl.UserId == userId);

            return Ok(new PostDto(
                postData.Id,
                postData.Caption,
                alreadyViewed ? postData.PostViewsCount : postData.PostViewsCount + 1,
                postData.PostLikesCount,
                postData.CommentsCount,
                postData.MediaFileId,
                postData.UserId,
                postData.UserName!,
                userId == postData.UserId,
                alreadyLiked,
                postData.CreatedAt));
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts() => Ok(_context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                ViewCount = p.PostViews.Count
            })
            .ToList()
            .Select(p => new PostListItemDto(p.Id, p.ViewCount)));

        [HttpGet("followings")]
        public async Task<IActionResult> GetFollowingsPosts()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var followingsPostsDtos = await _context.UserFollows
                .Where(uf => uf.FollowerId == userId)
                .SelectMany(uf => uf.Following!.Posts)
                    .Where(p => p.MediaFile != null)
                    .Include(p => p.PostViews)
                    .Include(p => p.PostLikes)
                    .Include(p => p.Comments)
                    .Include(p => p.MediaFile)
                    .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostDto(
                    p.Id,
                    p.Caption,
                    p.PostViews.Count,
                    p.PostLikes.Count,
                    p.Comments.Count,
                    p.MediaFile!.Id,
                    p.UserId,
                    p.User!.UserName!,
                    p.UserId == userId,
                    p.PostLikes.Any(pl => pl.UserId == userId),
                    p.CreatedAt
                ))
                .ToListAsync();

            return Ok(followingsPostsDtos);
        }

        [HttpPost("{id:guid}/view")]
        public async Task<IActionResult> MarkAsViewed(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            // Increment post views
            bool alreadyViewed = await _context.PostViews
                .AnyAsync(pl => pl.PostId == id && pl.UserId == userId);
            if (!alreadyViewed)
            {
                try
                {
                    var newView = new PostView { PostId = id, UserId = userId };
                    _context.PostViews.Add(newView);
                    await _context.SaveChangesAsync();
                    return Ok(new { incrementView = true });
                }
                catch (DbUpdateException)
                {
                }
            }

            return Ok(new { incrementView = false });
        }

        [HttpPatch("{id:guid}/caption")]
        public async Task<IActionResult> UpdatePostCaption(Guid id, [FromBody] UpdatePostCaptionDto dto)
        {
            if (dto == null) return BadRequest();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var oldPost = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id);
            if (oldPost == null) return NotFound();
            if (oldPost.UserId != userId) return Forbid();

            // Update caption
            oldPost.Caption = dto.Caption;
            await _context.SaveChangesAsync();

            return Ok(oldPost);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.MediaFile)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return NotFound();
            if (post.UserId != userId) return Forbid();

            await _postService.RemovePostAsync(post);

            return Ok();
        }

        [HttpPost("{id:guid}/like")]
        public async Task<IActionResult> LikeThePost(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");


            var post = await _context.Posts.FindAsync(id);
            var user = await _context.Users.FindAsync(userId);
            if (post == null) return NotFound();
            if (user == null) return Unauthorized();

            bool alreadyLiked = await _context.PostLikes
                .AnyAsync(pl => pl.PostId == post.Id && pl.UserId == userId);
            try
            {
                if (!alreadyLiked)
                {
                    var newLike = new PostLike { PostId = post.Id, UserId = userId };
                    _context.PostLikes.Add(newLike);
                    await _context.SaveChangesAsync();
                }
            }
            catch (DbUpdateException) { }

            return Ok(new { Success = true });
        }

        [HttpDelete("{id:guid}/like")]
        public async Task<IActionResult> UnlikePost(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");


            var post = await _context.Posts.FindAsync(id);
            var user = await _context.Users.FindAsync(userId);
            if (post == null) return NotFound();
            if (user == null) return Unauthorized();

            var postLike = await _context.PostLikes.FirstOrDefaultAsync(pl => pl.PostId == post.Id && pl.UserId == userId);
            if (postLike == null) return NotFound();
            _context.PostLikes.Remove(postLike);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{id:guid}/likes")]
        public async Task<IActionResult> GetListOfWhoLikedThePost(Guid id)
        {
            var likesOfPost = await _context.PostLikes
                .Include(pl => pl.User)
                .Where(pl => pl.PostId == id)
                .ToListAsync();

            return Ok(likesOfPost.Select(pl => pl.User?.ToUsersListItemDto()));
        }

        [HttpGet("{id:guid}/comments")]
        public async Task<IActionResult> GetPostComments(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var comments = await _context.Comments
                .Include(c => c.Post)
                .Include(c => c.User)
                    .ThenInclude(u => u!.Avatar)
                .Where(c => c.PostId == id)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            var commentsListDtos = comments.Select(c =>
            new CommentListItemDto(
                                    c.Id,
                                    c.UserId,
                                    c.User!.UserName!,
                                    c.Text ?? "",
                                    c.UserId == userId,
                                    c.CreatedAt));

            return Ok(commentsListDtos);
        }

        [HttpPost("{postId:guid}/comments")]
        public async Task<IActionResult> PostAComment(Guid postId, [FromBody] CreateCommentDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            if (string.IsNullOrEmpty(dto.Text))
                return BadRequest();

            var comment = dto.ToEntity(userId, postId);
            comment.CreatedAt = DateTime.Now;
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();

            return Ok(new { comment.Id });
        }

        [HttpDelete("{postId:guid}/comments/{commentId:guid}")]
        public async Task<IActionResult> DeleteMyComment(Guid postId, Guid commentId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var comment = await _context.Comments.FindAsync(commentId);

            if (comment == null)
                return NotFound();

            if (comment.UserId != userId)
                return Forbid();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("{postId:guid}/media")]
        public async Task<IActionResult> GetMedia(Guid postId)
        {
            var media = await _context.MediaFiles
                .FirstOrDefaultAsync(mf => mf.PostId == postId);

            if (media == null)
                return NotFound();

            var stream = await _mediaStorageService.GetMediaByIdAsync(media);

            return File(stream, media.MediaType, Path.GetFileName(media.FilePath));
        }
    }
}