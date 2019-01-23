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
                                            .Include(i=> i.Agenda)
                                            .Where(e => e.ID == entity.ID)
                                            .FirstOrDefault();

            base.EntriesClear();
            
            InsertUpdateOrDeleteTipoSesion(entityToUpdate, entity);
            InsertUpdateOrDeleteAgenda(entityToUpdate, entity);
            _dbcontext.Entry(entity).State = EntityState.Modified;
            base.Save();           
        }        

        private void InsertUpdateOrDeleteTipoSesion(Profesional profesionalExisting, Profesional profesional) {
            var deleted = profesionalExisting.Profesional_TipoSesion.Except(profesional.Profesional_TipoSesion, p => p.ID).ToList();
            deleted.ForEach(s => _dbcontext.Entry(s).State = EntityState.Deleted);
            profesional.Profesional_TipoSesion.ToList().ForEach(s => _dbcontext.Entry(s).State = s.ID > 0 ? EntityState.Modified : EntityState.Added);
        }

        private void InsertUpdateOrDeleteAgenda(Profesional profesionalExisting, Profesional profesional)
        {
            var deleted = profesionalExisting.Agenda.Except(profesional.Agenda, p => p.ID).ToList();
            deleted.ForEach(s => _dbcontext.Entry(s).State = EntityState.Deleted);
            profesional.Agenda.ToList().ForEach(s => _dbcontext.Entry(s).State = s.ID > 0 ? EntityState.Modified : EntityState.Added);
        }
    }
}
