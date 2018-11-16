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
    public class ProfesionalRepository : GenericRepository<Profesional>, IProfesionalRepository
    {
        public ProfesionalRepository(DbContext dbContext) : base(dbContext) { }

        public override void Edit(Profesional entity)
        {
            
            var entityToUpdate = base.Entity.Include(i => i.Profesional_TipoSesion)
                                            .Where(e => e.ID == entity.ID)
                                            .FirstOrDefault();

            IEnumerable<Profesional_TipoSesion> tiposOriginal = entityToUpdate.Profesional_TipoSesion;
            IEnumerable<Profesional_TipoSesion> tiposToUpdate = entity.Profesional_TipoSesion;

            var deletedTipos = tiposOriginal.Except(tiposToUpdate, x => x.ID).ToList();                     
            var insertedTipos = tiposToUpdate.Except(tiposOriginal, x => x.ID).ToList();

            base.EntriesClear();


            deletedTipos.ForEach(i => _dbcontext.Entry(i).State = EntityState.Deleted);
            insertedTipos.ForEach(i => _dbcontext.Entry(i).State = i.ID > 0 ? EntityState.Modified : EntityState.Added);

            base.Save();

            _dbcontext.Entry(entity).State = EntityState.Modified;
            
            base.Save();
        }
    }
}
