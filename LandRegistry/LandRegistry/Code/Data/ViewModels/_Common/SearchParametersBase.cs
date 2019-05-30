namespace LandRegistry.Code.Data.ViewModels._Common
{
    public class SearchParametersBase
    {
        public string OrderBy { get; set; } = "Id";
        public bool IsAsc { get; set; } = false;
        public int? Skip { get; set; } = 0;
        public int? Take { get; set; } = 50;
    }
}