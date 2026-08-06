using Microsoft.AspNetCore.Mvc;
using Socialgram.Domain.Entities;

namespace Socialgram.Services.Interfaces
{
    public interface IMediaStorageService
    {
        Task<Guid> SaveMediaAsync(IFormFile file, Post post);
        Task<FileStream> GetMediaByIdAsync(MediaFile media);
        Task DeleteMedia(MediaFile mediaFile);
    }
}
