using LandRegistry.Code.Data.ViewModels._Common;

namespace LandRegistry.Code.Data.ViewModels
{
    public class LandSearchParameters : SearchParametersBase
    {
        public int? Id { get; set; }
        public string Name { get; set; }
    }
}