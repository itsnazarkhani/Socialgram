using Socialgram.Data;
using Socialgram.DTOs;
using Socialgram.Domain.Entities;
using Socialgram.Services.Interfaces;

namespace Socialgram.Services
{
    public class PostService(SocialgramDbContext context, IMediaStorageService storageService)
    {
        private readonly SocialgramDbContext _context = context;
        private readonly IMediaStorageService _storageService = storageService;

        /// <summary>
        /// Removes the post from the database and also removes the associated media file record and
        /// media file from the disk
        /// </summary>
        /// <param name="post">The post to be removed.</param>
        public async Task RemovePostAsync(Post post)
        {
            var mediaFile = post.MediaFile;
            // Remove the media file from disk
            if (mediaFile != null)
                await _storageService.DeleteMedia(mediaFile);

            _context.PostLikes.RemoveRange(
                _context.PostLikes.Where(pl => pl.PostId == post.Id));

            _context.PostViews.RemoveRange(
                _context.PostViews.Where(pv => pv.PostId == post.Id));

            _context.Comments.RemoveRange(
                _context.Comments.Where(c => c.PostId == post.Id));

            // Remove The likes of the post
            post.PostLikes.Clear();
            // Remove the Post (the associated media file record will deleted automatically)
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }

        public async Task<Guid> AddPostAsync(CreatePostDto dto, IFormFile file, Guid userId)
        {
            var post = new Post() { Caption = dto.Caption, UserId = userId, CreatedAt = DateTime.Now };

            try
            {
                // Save the file
                await _storageService.SaveMediaAsync(file, post);
                await _context.Posts.AddAsync(post);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }

            return post.Id;
        }
    }
}
