using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Application.Common.Exceptions
{
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(Type entityType, object key)
            : base($"Entity of type {entityType.Name} with key {key} was not found.")
        {
        }

        public EntityNotFoundException(Type entityType, object key, Exception innerException)
            : base($"Entity of type {entityType.Name} with key {key} was not found.", innerException)
        {
        }

        public EntityNotFoundException(Type entityType, object key, string message)
            : base($"Entity of type {entityType.Name} with key {key} was not found. {message}")
        {
        }
    }
}
