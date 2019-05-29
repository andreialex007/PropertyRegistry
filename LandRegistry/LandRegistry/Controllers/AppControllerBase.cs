using LandRegistry.Code;
using LandRegistry.Code.Data;
using LandRegistry.Code.Exceptions;
using LandRegistry.Code.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LandRegistry.Controllers
{
    public class AppControllerBase : Controller
    {
        protected AppService Service { get; set; }
        private readonly IHostingEnvironment _hostingEnvironment;

        public AppControllerBase(IHostingEnvironment hostingEnvironment)
        {
            Service = new AppService(new AppDbContext());
            _hostingEnvironment = hostingEnvironment;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) Service.Dispose();
            base.Dispose(disposing);
        }

        public override async void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                base.OnActionExecuting(context);
            }
            catch (ValidationException e)
            {
                var errorsView = await this.RenderViewAsync("~/Views/Shared/_Errors.cshtml", e.Errors);
                context.Result = new JsonResult(new
                {
                    errorsView
                });
            }


        }
    }

}
