using LandRegistry.Code.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace LandRegistry.Code.Data
{
    public class AppDbContext : DbContext
    {
        public static string ConnectionString { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured) optionsBuilder.UseSqlServer(ConnectionString);
        }

        public AppDbContext()
        {

        }

        public DbSet<Land> Lands { get; set; }
        public DbSet<LandRightType> LandRightType { get; set; }
        public DbSet<LandType> LandType { get; set; }
    }
}
