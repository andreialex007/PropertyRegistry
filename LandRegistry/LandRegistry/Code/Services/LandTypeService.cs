using LandRegistry.Code.Data;

namespace LandRegistry.Code.Services
{
    public class LandTypeService : ServiceBase
    {
        public LandTypeService(AppDbContext db, AppService appService) : base(db, appService)
        {
        }
    }
}
