namespace LandRegistry.Code.Serialization
{
    public class Feature
    {
        public string type { get; set; }
        public Properties2 properties { get; set; }
        public Geometry geometry { get; set; }
    }
}