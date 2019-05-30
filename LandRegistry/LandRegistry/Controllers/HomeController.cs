using LandRegistry.Code.Data.ViewModels;
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

        [HttpGet]
        public IActionResult SaveLand([FromBody] LandItem item)
        {
            this.Service.Land.Save(item);
            return Json(item);
        }
    }
}
