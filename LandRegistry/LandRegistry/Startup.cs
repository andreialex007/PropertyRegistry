using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using LandRegistry.Code.Data;
using LandRegistry.Code.Data.Models;
using LandRegistry.Code.Extensions;
using LandRegistry.Code.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LandRegistry
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            //In-Memory
            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.Cookie.IsEssential = true;
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddMvc()
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                    var dateConverter = new Newtonsoft.Json.Converters.IsoDateTimeConverter
                    {
                        DateTimeFormat = "dd.MM.yyyy HH:mm"
                    };
                    options.SerializerSettings.Converters.Add(dateConverter);
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);


            AppDbContext.ConnectionString = Configuration["AppSettings:MainConnnectionString"];

            using (var db = new AppDbContext())
            {
                db.Database.Migrate();
                if (!db.LandRightType.Any())
                {
                    db.LandRightType.Add(new LandRightType { Name = "Собственность" });
                    db.LandRightType.Add(new LandRightType { Name = "Пожизненное наследуемое владение" });
                    db.LandRightType.Add(new LandRightType { Name = "Постоянное (бессрочное)пользование" });
                    db.LandRightType.Add(new LandRightType { Name = "Аренда" });
                    db.LandRightType.Add(new LandRightType { Name = "Оперативное управление" });
                    db.SaveChanges();
                }

                if (!db.LandType.Any())
                {
                    db.LandType.Add(new LandType { Name = "Земельный участок" });
                    db.LandType.Add(new LandType { Name = "Единое землепользование" });
                    db.LandType.Add(new LandType { Name = "Часть земельного участка" });
                    db.SaveChanges();
                }


            }

            ImportMoscowGeoData();

            services.Configure<RequestLocalizationOptions>(options =>
            {
                options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture("ru-RU");
                options.SupportedCultures = new List<CultureInfo> { new CultureInfo("ru-RU") };
            });

        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseSession();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        public void ImportMoscowGeoData()
        {

            using (var db = new AppDbContext())
            {
                if (!db.Lands.Any())
                {

                    var readAllText = File.ReadAllText(@"C:\mo.geojson");
                    var deserializeObject = JsonConvert.DeserializeObject<RootObject>(readAllText);
                    var geometryPoints = deserializeObject.features
                        .Select(x => new { x.properties.NAME, x.properties.TYPE_MO, x.geometry.Points })
                        .Where(x => x.Points.Any())
                        .ToList();

                    var random = new Random();
                    foreach (var geometryPoint in geometryPoints)
                    {
                        var landRightTypes = db.LandRightType.ToList();
                        var landTypes = db.LandType.ToList();

                        var landRightType = landRightTypes.Random();
                        var landType = landTypes.Random();

                        var serializeObject = JsonConvert.SerializeObject(geometryPoint.Points.Select(x => new { lat = x.Y, lng = x.X }).ToList());

                        var land = new Land
                        {
                            LandRightTypeId = landRightType.Id,
                            LandTypeId = landType.Id,
                            Name = geometryPoint.NAME + " - " + geometryPoint.TYPE_MO,
                            CadastralNumberOfLand = "47:14:1203001:" + random.Next(10000, 99999999),
                            AssetNumber = "",
                            Coordinates = serializeObject
                        };

                        db.Lands.Add(land);
                        db.SaveChanges();
                    }
                }

            }


        }
    }
}
