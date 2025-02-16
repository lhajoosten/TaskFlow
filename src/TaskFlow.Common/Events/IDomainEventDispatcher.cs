namespace TaskFlow.Common.Events
{
    public interface IDomainEventDispatcher
    {
        Task DispatchEventsAsync(IEnumerable<IDomainEvent> events, CancellationToken cancellationToken = default);
    }
}
