using System;
using System.Collections.Generic;
using System.Linq;

namespace LandRegistry.Code.Utils
{
    public static class EnumerableHelper
    {
        private static readonly Random random;

        static EnumerableHelper()
        {
            random = new Random();
        }

        public static T Random<T>(IEnumerable<T> input)
        {
            return input.ElementAt(random.Next(input.Count()));
        }

    }
}