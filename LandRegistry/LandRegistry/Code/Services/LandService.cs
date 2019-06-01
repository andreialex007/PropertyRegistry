using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using LandRegistry.Code.Data;
using LandRegistry.Code.Data.Models;
using LandRegistry.Code.Data.ViewModels;
using LandRegistry.Code.Extensions;
using Microsoft.AspNetCore.StaticFiles;

namespace LandRegistry.Code.Services
{
    public class LandService : ServiceBase
    {
        public LandService(AppDbContext db, AppService appService) : base(db, appService)
        {
        }

        public LandItem Get(int id)
        {
            var landItem = new LandItem();

            if (id != 0)
            {
                landItem = Db.Lands
                    .Select(x => new LandItem
                    {
                        Id = x.Id,
                        Name = x.Name,
                        AssetNumber = x.AssetNumber,
                        CadastralNumberOfLand = x.CadastralNumberOfLand,
                        DocumentOnLand = x.DocumentOnLand,
                        Coordinates = x.Coordinates,
                        DocumentOnLandFileName = x.DocumentOnLandFileName,
                        LandTypeId = x.LandTypeId,
                        LandRightTypeId = x.LandRightTypeId,
                        LandRightType = x.LandRightTypeId.HasValue ? new LandRightTypeItem
                        {
                            Name = x.LandRightType.Name,
                            Id = x.LandRightType.Id
                        } : new LandRightTypeItem(),
                        LandType = x.LandTypeId.HasValue ? new LandTypeItem
                        {
                            Name = x.LandType.Name,
                            Id = x.LandType.Id
                        } : new LandTypeItem()
                    })
                    .Single(x => x.Id == id);
            }

            if (landItem.DocumentOnLand != null)
            {
                var provider = new FileExtensionContentTypeProvider();
                var providerMappings = provider.Mappings;
                var extension = Path.GetExtension(landItem.DocumentOnLandFileName);
                landItem.DocumentBase64 = $"data:{providerMappings[extension]};base64,{Convert.ToBase64String(landItem.DocumentOnLand)}";
            }


            landItem.AvaliableLandRightTypeItems = this.App.LandRightType.All();
            landItem.AvaliableLandTypeItems = this.App.LandType.All();

            return landItem;
        }

        public (List<LandItem> items, int total, int filtered) Search(LandSearchParameters parameters)
        {
            var initialQuery = Db.Lands.AsQueryable();

            var query = initialQuery
                .Select(x => new LandItem
                {
                    Id = x.Id,
                    Name = x.Name,
                    AssetNumber = x.AssetNumber,
                    CadastralNumberOfLand = x.CadastralNumberOfLand,
                    DocumentOnLand = x.DocumentOnLand,
                    LandTypeId = x.LandTypeId,
                    Coordinates = x.Coordinates,
                    LandRightType = x.LandRightTypeId != null ? new LandRightTypeItem
                    {
                        Name = x.LandRightType.Name,
                        Id = x.LandRightType.Id
                    } : new LandRightTypeItem(),
                    LandType = x.LandTypeId != null ? new LandTypeItem
                    {
                        Name = x.LandType.Name,
                        Id = x.LandType.Id
                    } : new LandTypeItem()
                });

            var total = query.Count();

            var filtered = query.Count();

            var items = query
                .OrderBy(parameters.OrderBy, parameters.IsAsc)
                .TakePage(parameters.Skip.Value, parameters.Take.Value)
                .ToList();

            return (items, total, filtered);
        }

        public void Save(LandItem inputItem)
        {
            inputItem.GetValidationErrors().ThrowIfHasErrors();

            var dbItem = new Land();

            if (inputItem.Id == 0)
            {
                dbItem = new Land();
                Db.Lands.Add(dbItem);
            }
            else
            {
                dbItem = Db.Lands.Single(x => x.Id == inputItem.Id);
            }

            dbItem.AssetNumber = inputItem.AssetNumber;
            dbItem.CadastralNumberOfLand = inputItem.CadastralNumberOfLand;
            dbItem.Name = inputItem.Name;

            dbItem.Coordinates = inputItem.Coordinates;
            dbItem.LandRightTypeId = inputItem.LandRightTypeId;
            dbItem.LandTypeId = inputItem.LandTypeId;
            dbItem.DocumentOnLand = inputItem.DocumentOnLand;
            dbItem.DocumentOnLandFileName = inputItem.DocumentOnLandFileName;
            Db.SaveChanges();

            inputItem.Id = dbItem.Id;
        }

        public void Delete(int id)
        {
            var item = Db.Lands.Single(x => x.Id == id);
            Db.Lands.Remove(item);
            Db.SaveChanges();
        }
    }
}
