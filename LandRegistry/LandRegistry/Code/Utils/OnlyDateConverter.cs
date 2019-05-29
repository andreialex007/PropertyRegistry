using Newtonsoft.Json.Converters;

namespace LandRegistry.Code.Utils
{
    public class OnlyDateConverter : IsoDateTimeConverter
    {
        public OnlyDateConverter()
        {
            DateTimeFormat = "dd.MM.yyyy";
        }
    }
}
