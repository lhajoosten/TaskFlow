using MediatR;

namespace TaskFlow.Common.CQRS
{
    public interface IQuery<TResponse> : IRequest<Result<TResponse>>
    {
    }
}
