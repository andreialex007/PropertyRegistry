using System;
using System.IO;
using LandRegistry.Code.Data.ViewModels._Common;
using Microsoft.AspNetCore.Http;

namespace LandRegistry.Code.Utils
{
    public static class CommonUtils
    {
        public static string ReverseMapPath(string path)
        {
            var appPath = ""; // HttpContext.Current.Request.PhysicalApplicationPath;
            var res = string.Format("/{0}", path.Replace(appPath, string.Empty).Replace("\\", "/"));
            return res;
        }

        public static void DeleteFile(string url)
        {
            var path = ""; // HostingEnvironment.MapPath(url);
            File.Delete(path);
        }

        public static string CopyFileToDirectory(string file, string directoryName)
        {
            var fileName = Path.GetFileName(file);
            var urlPath = GenerateUrlPathForFile(directoryName, fileName);
            File.Copy(file, urlPath.Path);
            return urlPath.Url;
        }

        public static string UploadFileToDirectory(IFormFile file, string directoryName)
        {
            if (file == null)
                throw new Exception("Empty file");

            var urlPath = GenerateUrlPathForFile(directoryName, file.FileName);
            // file.SaveAs(urlPath.Path);
            return urlPath.Url;
        }

        public static string UploadFileToDirectory(MemoryStream file, string directoryName, string fileName)
        {
            if (file == null)
                throw new Exception("Empty file");

            var urlPath = GenerateUrlPathForFile(directoryName, fileName);
            file.SaveAs(urlPath.Path);
            return urlPath.Url;
        }

        public static string UploadFileToDirectory(byte[] file, string directoryName, string fileName)
        {
            using (var stream = new MemoryStream(file))
            {
                return UploadFileToDirectory(stream, directoryName, fileName);
            }
        }

        public static UrlPath GenerateUrlPathForFile(string directoryName, string fileName)
        {
            var dateFolder = DateTime.Now.ToString("dd-MM-yy");
            Directory.CreateDirectory(dateFolder);
            var path = Path.Combine(dateFolder, fileName);
            var url = ReverseMapPath(path);
            return new UrlPath
            {
                Path = path,
                Url = url
            };
        }

        public static void SaveAs(this MemoryStream inputStream, string path)
        {
            var ms = new MemoryStream(inputStream.ToArray());
            var fileStream = File.Create(path);
            ms.CopyTo(fileStream);
            fileStream.Close();
        }

        public static string LocationAndUnit(string unit, string location)
        {
            var result = string.Empty;
            if (!string.IsNullOrEmpty(unit))
                result += (unit + " / ");
            result += location;
            return result;
        }

    }
}
