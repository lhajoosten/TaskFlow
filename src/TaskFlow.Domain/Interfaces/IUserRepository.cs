using TaskFlow.Common.Interfaces;
using TaskFlow.Domain.Entities.UserAggregate;

namespace TaskFlow.Domain.Interfaces
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
        Task<User?> GetByIdentityIdAsync(string identityId, CancellationToken cancellationToken = default);
    }
}
