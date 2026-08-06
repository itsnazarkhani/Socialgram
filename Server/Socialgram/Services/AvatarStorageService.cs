using Microsoft.EntityFrameworkCore;
using Socialgram.Data;
using Socialgram.Domain.Entities;
using Socialgram.Helpers;

namespace Socialgram.Services
{
    public class AvatarStorageService
    {
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "AvatarFiles");
        private readonly SocialgramDbContext _context;

        public AvatarStorageService(SocialgramDbContext context)
        {
            _context = context;

            if (!Directory.Exists(_storagePath))
                Directory.CreateDirectory(_storagePath);
        }

        public async Task<FileStream> GetAvatarByIdAsync(Avatar avatar)
        {
            if (!File.Exists(avatar.FilePath))
                throw new FileNotFoundException();

            var mimeType = avatar.MediaType;
            var stream = new FileStream(avatar.FilePath, FileMode.Open, FileAccess.Read);
            return stream;
        }

        public async Task<Guid> UpdateAvatarAsync(IFormFile file, Guid userId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid avatar file.", nameof(file));

            var existingAvatar = await _context.Avatars
                .FirstOrDefaultAsync(a => a.UserId == userId);

            Guid avatarId;
            string filePath;

            if (existingAvatar != null)
            {
                avatarId = existingAvatar.Id;
                filePath = Path.Combine(_storagePath, avatarId.ToString() + Path.GetExtension(file.FileName));

                if (!string.IsNullOrWhiteSpace(existingAvatar.FilePath) && File.Exists(existingAvatar.FilePath))
                    File.Delete(existingAvatar.FilePath);

                existingAvatar.MediaType = file.GetMimeTypeByExtension();
                existingAvatar.FilePath = filePath;
                existingAvatar.UserId = userId;
            }
            else
            {
                avatarId = Guid.NewGuid();
                filePath = Path.Combine(_storagePath, avatarId + Path.GetExtension(file.FileName));

                var avatar = new Avatar
                {
                    Id = avatarId,
                    MediaType = file.GetMimeTypeByExtension(),
                    FilePath = filePath,
                    UserId = userId
                };

                await _context.Avatars.AddAsync(avatar);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            await _context.SaveChangesAsync();

            return avatarId;
        }

        public async Task DeleteAvatar(Avatar? avatarFile)
        {
            if (avatarFile != null && File.Exists(avatarFile?.FilePath))
            {
                File.Delete(avatarFile.FilePath);
                _context.Avatars.Remove(avatarFile);
                await _context.SaveChangesAsync();
            }
        }
    }
}
