using System;
using System.Runtime.Serialization;

namespace LandRegistry.Code.Exceptions
{
    public class AppCommonException : Exception
    {
        public AppCommonException()
        {
        }

        public AppCommonException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        public AppCommonException(string message)
            : base(message)
        {
        }

        protected AppCommonException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
