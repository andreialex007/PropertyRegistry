using System;
using LandRegistry.Code.Data.ViewModels;
using LandRegistry.Code.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace LandRegistry.Controllers
{
    public class HomeController : AppControllerBase
    {
        public HomeController(IHostingEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Search([FromBody] LandSearchParameters parameters)
        {
            var (items, total, filtered) = this.Service.Land.Search(parameters);
            return Json(new
            {
                items,
                total,
                filtered
            });
        }

        [HttpGet]
        public IActionResult LoadLand(int id)
        {
            var land = this.Service.Land.Get(id);
            return Json(land);
        }

        [HttpPost]
        public IActionResult SaveLand([FromBody] LandItem item)
        {
            if (item.DocumentBase64.HasValue()) item.DocumentOnLand = Convert.FromBase64String(item.DocumentBase64Data);
            this.Service.Land.Save(item);
            return Json(item);
        }

        [HttpGet]
        public IActionResult DeleteLand(int id)
        {
            this.Service.Land.Delete(id);
            return Json(new { result = "ok" });
        }
    }
}
