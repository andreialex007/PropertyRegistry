using System;
using System.Linq;
using System.Linq.Expressions;
using LandRegistry.Code.Data;
using LandRegistry.Code.Data.Models._Common;
using Microsoft.EntityFrameworkCore;

namespace LandRegistry.Code.Extensions
{
    public static class DbContextExtensions
    {
        public static void AttachIfDetached<T>(this AppDbContext db, T entity)
            where T : class
        {
            if (db.Entry(entity).State == EntityState.Detached)
                db.Set<T>().Attach(entity);
        }

        public static void Delete<T>(this AppDbContext db, Expression<Func<T, bool>> expression) where T : class
        {
            var items = db.Set<T>().Where(expression);
            db.Set<T>().RemoveRange(items);
        }

        public static void AddOrCreateEntity<T>(this AppDbContext db, T entity) where T : class, IpkidEntity
        {
            var entityState = entity.Id == 0 ? EntityState.Added : EntityState.Modified;
            db.Entry(entity).State = entityState;
            db.SaveChanges();
        }

        public static void AttachAndAdd<T>(this AppDbContext db, T entity) where T : class, IpkidEntity
        {
            db.Set<T>().Attach(entity);
            db.Entry(entity).State = EntityState.Added;
        }

        public static void Save<T>(this AppDbContext db, T entity) where T : class, IpkidEntity
        {
            db.Set<T>().Attach(entity);
            db.Entry(entity).State = entity.Id == 0 ? EntityState.Added : EntityState.Modified;
            db.SaveChanges();
        }

        public static void Attach<TEntity>(this AppDbContext _db, TEntity entity) where TEntity : class => _db.Set<TEntity>().Attach(entity);
        public static void Detach<TEntity>(this AppDbContext _db, TEntity entity) where TEntity : class => _db.Entry(entity).State = EntityState.Detached;
    }
}