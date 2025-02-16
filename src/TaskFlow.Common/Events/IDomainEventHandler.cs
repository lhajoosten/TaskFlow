using MediatR;

namespace TaskFlow.Common.Events
{
    public interface IDomainEventHandler<in TEvent> : INotificationHandler<TEvent>
           where TEvent : IDomainEvent, INotification
    {
    }
}
