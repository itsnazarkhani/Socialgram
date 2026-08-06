using Microsoft.AspNetCore.Http;
using Socialgram.Domain.Entities;

namespace Socialgram.Application.Interfaces
{
    public interface IMediaStorageService
    {
        Task<Guid> SaveMediaAsync(IFormFile file, Post post);
        Task<FileStream> GetMediaByIdAsync(MediaFile media);
        Task DeleteMedia(MediaFile mediaFile);
    }
}
