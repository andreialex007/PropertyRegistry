using System.Collections.Generic;
using LandRegistry.Code.Data.ViewModels._Common;

namespace LandRegistry.Code.Data.ViewModels
{
    public class LandRightTypeItem : ViewModelBase
    {
        public string Name { get; set; }
        public List<LandItem> Lands { get; set; } = new List<LandItem>();
    }
}
