using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace LandRegistry.Code.Serialization
{
    public class Point
    {
        public double X;
        public double Y;

        public Point(double x, double y)
        {
            this.X = x;
            this.Y = y;
        }
    }

    public class Geometry
    {
        public string type { get; set; }
        public List<List<List<object>>> coordinates { get; set; }

        public List<Point> Points
        {
            get
            {
                try
                {
                    var points = coordinates.First().First();

                    var jToken = points.Select(x => (JArray)x)
                        .Select(x => new Point(x[0].Value<double>(), x[1].Value<double>()))
                        .ToList();

                    return jToken;
                }
                catch (Exception ex)
                {
                    var points = coordinates.First();

                    var jToken = points.Select(x => x)
                        .Select(x => new Point(Convert.ToDouble(x[0]), Convert.ToDouble(x[1])))
                        .ToList();

                    return jToken;
                }
            }
        }

    }
}