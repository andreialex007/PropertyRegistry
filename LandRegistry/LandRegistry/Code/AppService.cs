using System;
using LandRegistry.Code.Data;
using LandRegistry.Code.Services;

namespace LandRegistry.Code
{
    public class AppService : IDisposable
    {
        private readonly AppDbContext _appDbContext;
        public LandService Land { get; set; }
        public LandRightTypeService LandRightType { get; set; }
        public LandTypeService LandType { get; set; }

        public AppService(AppDbContext db)
        {
            Land = new LandService(db, this);
            LandRightType = new LandRightTypeService(db, this);
            LandType = new LandTypeService(db, this);
            _appDbContext = db;
        }

        public void Dispose()
        {
            _appDbContext.Dispose();
        }
    }
}
