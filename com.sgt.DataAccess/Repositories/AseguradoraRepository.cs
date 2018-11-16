using com.sgt.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using com.sgt.DataAccess.ExtensionMethod;

namespace com.sgt.DataAccess.Repositories
{
    public class AseguradoraRepository : GenericRepository<Aseguradora>, IAseguradoraRepository
    {
        public AseguradoraRepository(DbContext dbContext) : base(dbContext) { }


        public override void Edit(Aseguradora entity)
        {
            using (DbContextTransaction trans = this._dbcontext.Database.BeginTransaction())
            {
                try
                {


                    //var entityToUpdate = base.Entity
                    //    .Include(l => l.Aseguradora_Plan)
                    //    .Where(e => e.ID == entity.ID)
                    //    .FirstOrDefault();
                    ////EntriesClear();

                    ////var item = entityToUpdate.Aseguradora_Plan.ElementAt(entityToUpdate.Aseguradora_Plan.Count-1);

                    ////entityToUpdate.Aseguradora_Plan.Remove(item);
                    ////item.FechaModificacion = entity.FechaModificacion;
                    ////item.UsuarioModificacion = entity.UsuarioModificacion;

                    ////_dbcontext.Entry(entityToUpdate).State = EntityState.Detached;
                    foreach (var np in entity.Aseguradora_Plan)
                    {
                        np.FechaModificacion = entity.FechaModificacion;
                        np.AseguradoraID = entity.ID;
                        np.UsuarioModificacion = entity.UsuarioModificacion;
                        _dbcontext.Entry(np).State = np.ID > 0 ? EntityState.Modified : EntityState.Added;
                    }
                    //_dbcontext.Entry(entityToUpdate).CurrentValues.SetValues(entity);

                    _dbcontext.Entry(entity).State = EntityState.Modified;

                    Save();
                    trans.Commit();
                }
                catch (Exception ex)
                {
                    trans.Rollback();
                    throw ex;
                }
                finally
                {
                    trans.Dispose();
                }
            }
        }
    }


}
