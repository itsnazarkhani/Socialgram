using Socialgram.Entities.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Socialgram.Entities
{
    public class Comment : IEntity<Guid>
    {
        public Guid Id { get; set; }
        [Required]
        public string Text { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid PostId { get; set; }
        public Post? Post { get; set; }
    }
}
