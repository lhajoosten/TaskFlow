﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskFlow.Common.Events
{
    public interface IDomainEvent
    {
        DateTime OccurredOn { get; }
    }
}
