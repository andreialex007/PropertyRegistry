using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LandRegistry.Models;
using Microsoft.AspNetCore.Hosting;

namespace LandRegistry.Controllers
{
    public class HomeController : AppControllerBase
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public HomeController(IHostingEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }
    }
}
