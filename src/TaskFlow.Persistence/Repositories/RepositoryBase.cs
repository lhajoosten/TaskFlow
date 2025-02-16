using Microsoft.EntityFrameworkCore;
using TaskFlow.Common.Entities;
using TaskFlow.Common.Interfaces;
using TaskFlow.Common.Specifications;
using TaskFlow.Persistence.Persistence;

namespace TaskFlow.Persistence.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : EntityBase
    {
        private readonly TaskFlowDbContext _dbContext;
        private readonly DbSet<T> _dbSet;
        private readonly IUnitOfWork _unitOfWork;

        public RepositoryBase(TaskFlowDbContext dbContext, IUnitOfWork unitOfWork)
        {
            _dbContext = dbContext;
            _dbSet = _dbContext.Set<T>();
            _unitOfWork = unitOfWork;
        }

        private async Task<TResult> ExecuteInTransactionAsync<TResult>(
            Func<Task<TResult>> operation,
            CancellationToken cancellationToken = default)
        {
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                var result = await operation();
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);
                return result;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }

        public async Task<T?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FindAsync([id], cancellationToken);
        }

        public async Task<IReadOnlyList<T>> ListAllAsync(CancellationToken cancellationToken = default)
        {
            return await _dbSet.ToListAsync(cancellationToken);
        }

        public async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
        {
            return await ExecuteInTransactionAsync(async () =>
            {
                await _dbSet.AddAsync(entity, cancellationToken);
                return entity;
            }, cancellationToken);
        }

        public async Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
        {
            await ExecuteInTransactionAsync(() =>
            {
                _dbSet.Update(entity);
                return Task.FromResult(true);
            }, cancellationToken);
        }

        public async Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
        {
            await ExecuteInTransactionAsync(() =>
            {
                _dbSet.Remove(entity);
                return Task.FromResult(true);
            }, cancellationToken);
        }

        public async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            return await ExecuteInTransactionAsync(async () =>
            {
                await _dbSet.AddRangeAsync(entities, cancellationToken);
                return entities;
            }, cancellationToken);
        }

        public async Task UpdateRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            await ExecuteInTransactionAsync(() =>
            {
                _dbSet.UpdateRange(entities);
                return Task.FromResult(true);
            }, cancellationToken);
        }

        public async Task DeleteRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
        {
            await ExecuteInTransactionAsync(() =>
            {
                _dbSet.RemoveRange(entities);
                return Task.FromResult(true);
            }, cancellationToken);
        }

        public async Task<T?> FirstOrDefaultAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<T>> ListAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).ToListAsync(cancellationToken);
        }

        public async Task<int> CountAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).CountAsync(cancellationToken);
        }

        public async Task<bool> AnyAsync(BaseSpecification<T> specification, CancellationToken cancellationToken = default)
        {
            return await ApplySpecification(specification).AnyAsync(cancellationToken);
        }

        private IQueryable<T> ApplySpecification(BaseSpecification<T> specification)
        {
            return SpecificationEvaluator<T>.GetQuery(_dbSet.AsQueryable(), specification);
        }
    }
}
