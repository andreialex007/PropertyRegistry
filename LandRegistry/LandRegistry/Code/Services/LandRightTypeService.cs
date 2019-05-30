using System.Collections.Generic;
using System.Linq;
using LandRegistry.Code.Data;
using LandRegistry.Code.Data.ViewModels;

namespace LandRegistry.Code.Services
{
    public class LandRightTypeService : ServiceBase
    {
        public LandRightTypeService(AppDbContext db, AppService appService) : base(db, appService)
        { }

        public List<LandRightTypeItem> All()
        {
            var items = Db.LandRightType
                .Select(x => new LandRightTypeItem
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
