using Socialgram.Infrastructure.Data;
using Socialgram.Domain.Entities;
using Socialgram.Infrastructure.Services.Helpers;
using Socialgram.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Socialgram.Infrastructure.Services
{
    public class MediaStorageService : IMediaStorageService
    {
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "MediaFiles");
        private readonly string _thumbnailPath = Path.Combine(Directory.GetCurrentDirectory(), "MediaFiles/thumbnails");
        private readonly SocialgramDbContext _context;
        private readonly HashSet<string> _allowedMediaMimeTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp",
        };

        public MediaStorageService(SocialgramDbContext context)
        {
            _context = context;

            if (!Directory.Exists(_storagePath))
                Directory.CreateDirectory(_storagePath);
        }

        public async Task<FileStream> GetMediaByIdAsync(MediaFile media)
        {
            if (!File.Exists(media.FilePath))
                throw new FileNotFoundException();

            var mimeType = media.MediaType;
            var stream = new FileStream(media.FilePath, FileMode.Open, FileAccess.Read);
            return stream;
        }

        public async Task<Guid> SaveMediaAsync(IFormFile file, Post post)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid media file provided.", nameof(file));

            var mimeType = file.GetMimeTypeByContent();
            if (string.IsNullOrEmpty(mimeType) || mimeType == "application/octet-stream")
            {
                mimeType = file.GetMimeTypeByExtension();
                if (string.IsNullOrEmpty(mimeType) || mimeType == "application/octet-stream")
                {
                    throw new InvalidOperationException("Could not determine the media type of the file.");
                }
            }

            if (!_allowedMediaMimeTypes.Contains(mimeType))
                throw new InvalidOperationException($"Unsupported media type: '{mimeType}'. Only images and videos are allowed.");

            var id = Guid.NewGuid();
            var extension = Path.GetExtension(file.FileName);
            var filePath = Path.Combine(_storagePath, $"{id}{extension}");

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                    await file.CopyToAsync(stream);
            }
            catch (Exception ex)
            {
                if (File.Exists(filePath)) File.Delete(filePath);
                throw new InvalidOperationException($"Failed to save the media file to disk. Error: {ex.Message}", ex);
            }

            string thumbnailFileName = $"{id}_thumb.jpg";
            string thumbnailFilepath = Path.Combine(_thumbnailPath, thumbnailFileName);

            var media = new MediaFile
            {
                Id = id,
                MediaType = mimeType,
                FilePath = filePath,
                Post = post
            };
            await _context.MediaFiles.AddAsync(media);

            return id;
        }

        public async Task DeleteMedia(MediaFile mediaFile)
        {
            _context.MediaFiles.Remove(mediaFile);
            await _context.SaveChangesAsync();

            if (mediaFile != null && File.Exists(mediaFile?.FilePath))
                File.Delete(mediaFile.FilePath);
        }
    }
}
