﻿namespace TaskFlow.Mailing.Models
{
    public class EmailDto
    {
        public required string To { get; set; }
        public required string Subject { get; set; }
        public required string Body { get; set; }
    }
}
