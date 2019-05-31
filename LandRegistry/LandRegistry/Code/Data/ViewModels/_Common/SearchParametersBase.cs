namespace LandRegistry.Code.Data.ViewModels._Common
{
    public abstract class SearchParametersBase
    {
        public string OrderBy { get; set; } = "Id";
        public bool IsAsc { get; set; } = true;
        public int? Skip { get; set; } = 0;
        public int? Take { get; set; } = 50;
    }
}