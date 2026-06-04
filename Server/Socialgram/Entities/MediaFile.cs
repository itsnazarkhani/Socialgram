using Socialgram.Entities.Interfaces;

namespace Socialgram.Entities
{
    public class MediaFile : IEntity<Guid>
    {
        public Guid Id { get; set; }
        public string FilePath { get; set; } = string.Empty;
        // MIME Type
        public string MediaType { get; set; } = string.Empty;

        public Guid PostId { get; set; }
        public Post? Post { get; set; }
    }
}
