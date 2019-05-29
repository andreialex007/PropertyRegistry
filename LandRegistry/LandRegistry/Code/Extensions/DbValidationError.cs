using System;

namespace LandRegistry.Code.Extensions
{
    /// <summary>
    /// Validation error. Can be either entity or property level validation error.
    /// </summary>
    [Serializable]
    public class DbValidationError
    {
        private readonly string _propertyName;
        private readonly string _errorMessage;
        public DbValidationError(string propertyName, string errorMessage)
        {
            this._propertyName = propertyName;
            this._errorMessage = errorMessage;
        }
        public string PropertyName => this._propertyName;
        public string ErrorMessage => this._errorMessage;
    }
}