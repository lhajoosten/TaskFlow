namespace TaskFlow.Common.Events
{
    public abstract class DomainEventBase : IDomainEvent
    {
        public DateTime OccurredOn { get; }
        public string EventId { get; }

        protected DomainEventBase()
        {
            EventId = Guid.NewGuid().ToString();
            OccurredOn = DateTime.UtcNow;
        }
    }
}
