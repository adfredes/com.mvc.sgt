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


        //public override void Edit(Aseguradora entity)
        //{
        //    using (DbContextTransaction trans = this._dbcontext.Database.BeginTransaction())
        //    {
        //        try
        //        {
        //            foreach (var np in entity.Aseguradora_Plan)
        //            {
        //                np.FechaModificacion = entity.FechaModificacion;
        //                np.AseguradoraID = entity.ID;
        //                np.UsuarioModificacion = entity.UsuarioModificacion;
        //                _dbcontext.Entry(np).State = np.ID > 0 ? EntityState.Modified : EntityState.Added;
        //            }
        //            //_dbcontext.Entry(entityToUpdate).CurrentValues.SetValues(entity);

        //            _dbcontext.Entry(entity).State = EntityState.Modified;

        //            Save();
        //            trans.Commit();
        //        }
        //        catch (Exception ex)
        //        {
        //            trans.Rollback();
        //            throw ex;
        //        }
        //        finally
        //        {
        //            trans.Dispose();
        //        }
        //    }
        //}




        public override void Edit(Aseguradora entity)
        {
            var entityToUpdate = base.Entity.Include(i => i.Aseguradora_Plan)                                            
                                            .Where(e => e.ID == entity.ID)
                                            .FirstOrDefault();

            base.EntriesClear();

            InsertUpdateOrDeletePlanes(entityToUpdate, entity);            
            _dbcontext.Entry(entity).State = EntityState.Modified;
            base.Save();
        }

        private void InsertUpdateOrDeletePlanes(Aseguradora entityExisting, Aseguradora entity)
        {
            var deleted = entityExisting.Aseguradora_Plan.Except(entity.Aseguradora_Plan, p => p.ID).ToList();
            deleted.ForEach(s => _dbcontext.Entry(s).State = EntityState.Deleted);
            entity.Aseguradora_Plan.ToList().ForEach(s => {
                s.FechaModificacion = entity.FechaModificacion;
                s.UsuarioModificacion = entity.UsuarioModificacion;
                _dbcontext.Entry(s).State = s.ID > 0 ? EntityState.Modified : EntityState.Added;
            });
        }
    }

   


}
