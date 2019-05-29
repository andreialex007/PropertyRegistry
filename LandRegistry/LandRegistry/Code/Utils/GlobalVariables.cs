using System;

namespace LandRegistry.Code.Utils
{
    public class GlobalVariables
    {
        public const int WorkingHoursPerDay = 6;

        public const int AverageSalaryInRegion = 80_000;

        public const double SalaryFix = 3.2;

        public const int WorkingDaysPerMonth = 21;

        public static readonly double SalaryWithFix = SalaryFix * AverageSalaryInRegion;

        public static readonly int WorkingHoursPerMonth = WorkingHoursPerDay * WorkingDaysPerMonth;

        public static readonly double AverageSalaryPerHour = Math.Round(SalaryWithFix / WorkingHoursPerMonth);

        public const double ExtraMarkup = 0.3;

        public const double FixesPercentage = 150;
    }
}
