using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using LandRegistry.Code.Data.ViewModels._Common;
using ValidationException = LandRegistry.Code.Exceptions.ValidationException;

namespace LandRegistry.Code.Extensions
{
    public static class ValidationExtensions
    {

        public static List<DbValidationError> GetValidationErrors<T>(this T entityBase)
            where T : ViewModelBase
        {
            var validationErrors = new List<DbValidationError>();
            var validationContext = new ValidationContext(entityBase);
            var results = new List<ValidationResult>();
            Validator.TryValidateObject(entityBase, validationContext, results);
            foreach (var validationResult in results)
            {
                foreach (var memberName in validationResult.MemberNames)
                {
                    validationErrors.Add(new DbValidationError(memberName, validationResult.ErrorMessage));
                }
            }
            return validationErrors;
        }

        public static void ThrowIfHasErrors(this IEnumerable<DbValidationError> errors)
        {
            var arrorsList = errors.ToList();
            if (arrorsList.Any())
                throw new ValidationException(arrorsList);
        }
    }
}