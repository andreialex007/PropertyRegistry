using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace LandRegistry.Code.Utils
{
    public static class EnumUtil
    {
        public static IEnumerable<T> GetValues<T>()
        {
            return Enum.GetValues(typeof(T)).Cast<T>();
        }

        public static string DescriptionAttr<T>(this T source)
        {
            if (source == null)
                return string.Empty;
            var fi = source.GetType().GetField(source.ToString());
            var attributes = (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute), false);
            return attributes.Length > 0 ? attributes[0].Description : source.ToString();
        }

        public static Dictionary<int, string> ToDictionary<TEnum>() where TEnum : struct
        {
            var dictionary = Enum.GetValues(typeof(TEnum))
                .Cast<TEnum>()
                .ToDictionary(
                    x => Convert.ToInt32(x),
                    DescriptionAttr)
                .OrderBy(x => x.Value)
                .ToDictionary(x => x.Key, x => x.Value);
            return dictionary;
        }
    }
}
