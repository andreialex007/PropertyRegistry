namespace LandRegistry.Code.Data.Models
{
    /// <summary>
    /// Земельный участок
    /// </summary>
    public class Land
    {
        public int Id { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Тип земельного участка
        /// </summary>
        public int? LandTypeId { get; set; }
        public LandType LandType { get; set; }

        /// <summary>
        /// Инвентарный номер основного средства
        /// </summary>
        public string AssetNumber { get; set; }

        /// <summary>
        /// Кадастровый номер земельного участка
        /// </summary>
        public string CadastralNumberOfLand { get; set; }

        /// <summary>
        /// Вид права Общества на земельный участок
        /// </summary>
        public int? LandRightTypeId { get; set; }
        public LandRightType LandRightType { get; set; }

        /// <summary>
        /// Правоустанавливающий документ на земельный участок
        /// </summary>
        public byte[] DocumentOnLand { get; set; }

    }
}