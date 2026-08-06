namespace Socialgram.Domain.Entities.Interfaces;

public interface IEntity<TId>
{
    TId Id { get; set; }
}
