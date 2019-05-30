using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LandRegistry.Code.Data.ViewModels._Common;

namespace LandRegistry.Code.Data.ViewModels
{
    public class LandItem : ViewModelBase
    {
        [Required(ErrorMessage = "Имя должно быть заполнено")]
        public string Name { get; set; }

        public int? LandTypeId { get; set; }
        public LandTypeItem LandType { get; set; }

        public string AssetNumber { get; set; }

        [Required(ErrorMessage = "Кадастровый номер участка должен быть заполнен")]
        public string CadastralNumberOfLand { get; set; }

        public int? LandRightTypeId { get; set; }
        public LandRightTypeItem LandRightType { get; set; }

        public byte[] DocumentOnLand { get; set; }

        public List<LandTypeItem> AvaliableLandTypeItems { get; set; } = new List<LandTypeItem>();
        public List<LandRightTypeItem> AvaliableLandRightTypeItems { get; set; } = new List<LandRightTypeItem>();
    }
}