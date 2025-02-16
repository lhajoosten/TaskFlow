using TaskFlow.Common.Entities;
using TaskFlow.Common.Interfaces;
using TaskFlow.Persistence.Persistence;

namespace TaskFlow.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly TaskFlowDbContext _context;
        private readonly Dictionary<Type, object> _repositories;

        public UnitOfWork(TaskFlowDbContext context)
        {
            _context = context;
            _repositories = [];
        }

        public IRepositoryBase<TEntity> GetRepository<TEntity>() where TEntity : EntityBase
        {
            var type = typeof(TEntity);
            if (!_repositories.TryGetValue(type, out object? value))
            {
                value = new RepositoryBase<TEntity>(_context, this);
                _repositories[type] = value;
            }

            return (IRepositoryBase<TEntity>)value;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            await _context.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            await _context.Database.CommitTransactionAsync(cancellationToken);
        }

        public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
        {
            await _context.Database.RollbackTransactionAsync(cancellationToken);
        }
    }
}
