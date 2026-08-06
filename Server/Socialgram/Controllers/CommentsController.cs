using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Socialgram.Infrastructure.Data;
using Socialgram.Application.DTOs;
using System.Security.Claims;

namespace Socialgram.Controllers
{
    [Authorize]
    [Route("api/[Controller]")]
    [ApiController]
    public class CommentsController(SocialgramDbContext context) : ControllerBase
    {
        private readonly SocialgramDbContext _context = context;

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetCommentById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("شناسه کاربر نامعتبر است.");

            var comment = await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null) return NotFound();

            var commentDto = new CommentListItemDto(
                comment.Id,
                comment.UserId,
                comment?.User?.UserName ?? "unknown",
                comment?.Text!,
                comment?.UserId == userId,
                comment?.CreatedAt ?? DateTime.Now);

            return Ok(commentDto);
        }
    }
}
