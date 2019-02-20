using com.sgt.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Repositories
{
    public abstract class GenericRepository<TEntity> : IRepository<TEntity> where TEntity: class
    {
        protected readonly DbContext _dbcontext;

        protected DbSet<TEntity> Entity { get; set; }

        public GenericRepository(DbContext dbContext)
        {
            this._dbcontext = dbContext;
            this.Entity = this._dbcontext.Set<TEntity>();
        }

        public TEntity Add(TEntity entity)
        {
            EntriesClear();
            Entity.Add(entity);            
            //_dbcontext.Entry(entity).State = EntityState.Added;
            Save();
            return entity;
        }

        public void Delete(TEntity entity)
        {
            EntriesClear();
            _dbcontext.Entry(entity).State = EntityState.Deleted;
            Save();
        }

        public virtual void Edit(TEntity entity)
        {
            EntriesClear();
            _dbcontext.Entry(entity).State = EntityState.Modified;
            Save();
        }

        public IQueryable<TEntity> FindBy(Expression<Func<TEntity, bool>> predicate)
        {
            return Entity.Where(predicate);
        }

        public IQueryable<TEntity> GetAll()
        {
            return Entity;
        }

        public TEntity Find(int id)
        {
            return Entity.Find(id);
        }

        protected void EntriesClear()
        {
            foreach (var entry in _dbcontext.ChangeTracker.Entries())
            {
                entry.State = EntityState.Detached;
            }
        }       

        protected void Save()
        {
            try
            {
                this._dbcontext.SaveChanges();
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            {
                Exception raise = dbEx;
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        string message = string.Format("{0}:{1}",
                            validationErrors.Entry.Entity.ToString(),
                            validationError.ErrorMessage);
                        // raise a new exception nesting
                        // the current instance as InnerException
                        raise = new InvalidOperationException(message, raise);
                    }
                }
                throw raise;
            }
        }
    }
}
