using TaskFlow.Common.Entities;
using TaskFlow.Common.Specifications;

namespace TaskFlow.Common.Interfaces
{
    public interface IRepositoryBase<T> where T : EntityBase
    {
        // Read operations
        Task<T?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> ListAllAsync(CancellationToken cancellationToken = default);

        // Write operations
        Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
        Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
        Task DeleteAsync(T entity, CancellationToken cancellationToken = default);

        // Collection operations
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
        Task UpdateRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
        Task DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);

        // Query operations
        Task<T?> FirstOrDefaultAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> ListAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default);
        Task<int> CountAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default);
        Task<bool> AnyAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default);
    }
}
