using System.Collections.Generic;

namespace LandRegistry.Code.Serialization
{
    public class RootObject
    {
        public string type { get; set; }
        public Crs crs { get; set; }
        public List<Feature> features { get; set; }
    }
}