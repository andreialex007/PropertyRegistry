using LandRegistry.Code.Data;

namespace LandRegistry.Code.Services
{
    public class LandService : ServiceBase
    {
        public LandService(AppDbContext db, AppService appService) : base(db, appService)
        {
        }
    }
}
