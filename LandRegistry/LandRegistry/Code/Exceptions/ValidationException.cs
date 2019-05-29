using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using LandRegistry.Code.Extensions;

namespace LandRegistry.Code.Exceptions
{
    public class ValidationException : AppCommonException
    {
        public List<DbValidationError> Errors { get; set; }

        public ValidationException()
        {
            Errors = new List<DbValidationError>();
        }

        public ValidationException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        public ValidationException(string validationSummary)
            : this()
        {
            Errors.Add(new DbValidationError(string.Empty, validationSummary));
        }

        protected ValidationException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }

        public ValidationException(List<DbValidationError> errors)
        {
            Errors = errors;
        }
    }
}
