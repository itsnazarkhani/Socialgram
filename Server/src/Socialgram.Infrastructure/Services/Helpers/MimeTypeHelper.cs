using Microsoft.AspNetCore.Http;
using MimeDetective;

namespace Socialgram.Infrastructure.Services.Helpers
{
    public static class MimeTypeHelper
    {
        private static readonly Dictionary<string, string> _extensionToMimeTypeMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            // تصاویر
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".png", "image/png" },
            { ".gif", "image/gif" },
            { ".bmp", "image/bmp" },
            { ".webp", "image/webp" },
            { ".svg", "image/svg+xml" },
            { ".tiff", "image/tiff" },
            { ".ico", "image/x-icon" },

            // ویدئوها
            { ".mp4", "video/mp4" },
            { ".mov", "video/quicktime" },
            { ".avi", "video/x-msvideo" },
            { ".wmv", "video/x-ms-wmv" },
            { ".mkv", "video/x-matroska" },
            { ".webm", "video/webm" },

            // فایل‌های صوتی
            { ".mp3", "audio/mpeg" },
            { ".wav", "audio/wav" },
            { ".ogg", "audio/ogg" },
            { ".aac", "audio/aac" },

            // اسناد و فایل‌های متنی
            { ".pdf", "application/pdf" },
            { ".doc", "application/msword" },
            { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            { ".xls", "application/vnd.ms-excel" },
            { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            { ".ppt", "application/vnd.ms-powerpoint" },
            { ".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
            { ".txt", "text/plain" },
            { ".rtf", "application/rtf" },
            { ".html", "text/html" },
            { ".htm", "text/html" },
            { ".css", "text/css" },
            { ".js", "application/javascript" },
            { ".json", "application/json" },
            { ".xml", "application/xml" },

            // فایل‌های فشرده
            { ".zip", "application/zip" },
            { ".rar", "application/vnd.rar" },
            { ".7z", "application/x-7z-compressed" },
            { ".tar", "application/x-tar" },
            { ".gz", "application/gzip" },

            // سایر
            { ".exe", "application/x-msdownload" },
            { ".dll", "application/x-msdownload" },
            { ".sql", "text/plain" }, 
            { ".log", "text/plain" },
            { ".csv", "text/csv" }
        };

        /// <summary>
        /// Gets MIME type of a given file based on its extension.
        /// </summary>
        /// <param name="file">The file which to determine its MIME type.</param>
        /// <returns>MIME type of the file, otherwise its going to return "application/octet-stream" as an unknown file type.</returns>
        public static string GetMimeTypeByExtension(this IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName);

            if (string.IsNullOrEmpty(extension)) return "application/octet-stream";

            if (!extension.StartsWith('.'))
                extension = "." + extension;

            if (_extensionToMimeTypeMap.TryGetValue(extension, out var mimeType))
                return mimeType;

            return "application/octet-stream";
        }

        /// <summary>
        /// Gets MIME type of a given file by inspecting its content (magic numbers).
        /// Requires the MimeDetective package.
        /// </summary>
        /// <param name="file">The file which to determine its MIME type.</param>
        /// <returns>MIME type of the file, otherwise "application/octet-stream" as an unknown file type.</returns>
        public static string GetMimeTypeByContent(this IFormFile file)
        {
            if (file == null || file.Length == 0) return "application/octet-stream";

            using (var stream = file.OpenReadStream())
            {
                var inspector = new ContentInspectorBuilder()
                {
                    Definitions = MimeDetective.Definitions.DefaultDefinitions.All()
                }.Build();

                var result = inspector.Inspect(stream).ByMimeType().FirstOrDefault();

                return result?.MimeType.Trim().ToLowerInvariant() ?? "application/octet-stream";
            }
        }
    }
}
