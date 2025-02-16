namespace TaskFlow.Common.Services
{
    public interface ICurrentUserService
    {
        string UserId { get; }
        string Name { get; }
        string Email { get; }
        bool IsAuthenticated { get; }
    }
}
