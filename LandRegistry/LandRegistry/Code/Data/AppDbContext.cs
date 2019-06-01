using LandRegistry.Code.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LandRegistry.Code.Data
{
    public class AppDbContext : DbContext
    {
        public static string ConnectionString { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured) optionsBuilder.UseSqlServer("Data Source=31.31.196.234;Initial Catalog=u0733543_root;User Id=u0733543_root;Password=$tr0#1Sng;");
        }

        public AppDbContext()
        {

        }

        public DbSet<Land> Lands { get; set; }
        public DbSet<LandRightType> LandRightType { get; set; }
        public DbSet<LandType> LandType { get; set; }
    }
}
