using TaskFlow.Common.Entities;

namespace TaskFlow.Common.Interfaces
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        // Repository accessors
        IRepositoryBase<TEntity> GetRepository<TEntity>() where TEntity : EntityBase;

        // Transaction management
        Task BeginTransactionAsync(CancellationToken cancellationToken = default);
        Task CommitTransactionAsync(CancellationToken cancellationToken = default);
        Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    }
}
