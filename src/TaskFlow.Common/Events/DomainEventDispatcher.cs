using MediatR;
using Microsoft.Extensions.Logging;

namespace TaskFlow.Common.Events
{
    public class DomainEventDispatcher : IDomainEventDispatcher
    {
        private readonly IPublisher _mediator;
        private readonly ILogger<DomainEventDispatcher> _logger;

        public DomainEventDispatcher(IPublisher mediator, ILogger<DomainEventDispatcher> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        public async Task DispatchEventsAsync(IEnumerable<IDomainEvent> events, CancellationToken cancellationToken = default)
        {
            foreach (var @event in events)
            {
                _logger.LogInformation("Dispatching domain event {EventName}", @event.GetType().Name);
                await _mediator.Publish(@event, cancellationToken);
            }
        }
    }
}
