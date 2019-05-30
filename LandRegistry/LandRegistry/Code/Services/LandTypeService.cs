using System.Collections.Generic;
using System.Linq;
using LandRegistry.Code.Data;
using LandRegistry.Code.Data.ViewModels;

namespace LandRegistry.Code.Services
{
    public class LandTypeService : ServiceBase
    {
        public LandTypeService(AppDbContext db, AppService appService) : base(db, appService)
        {
        }

        public List<LandTypeItem> All()
        {
            var items = Db.LandRightType
                .Select(x => new LandTypeItem
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .OrderBy(x => x.Name)
                .ToList();

            return items;
        }
    }
}
