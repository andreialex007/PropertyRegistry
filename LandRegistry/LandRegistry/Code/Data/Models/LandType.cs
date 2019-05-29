using System.Collections.Generic;

namespace LandRegistry.Code.Data.Models
{
    public class LandType
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<Land> Lands { get; set; } = new List<Land>();
    }
}