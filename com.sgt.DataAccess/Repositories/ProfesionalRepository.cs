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
                                            .Include(i=> i.HorariosProfesionales)
                                            .Where(e => e.ID == entity.ID)
                                            .FirstOrDefault();

            var horariosProfesionales = entityToUpdate.HorariosProfesionales.ToList();
            var profesional_TipoSesion = entityToUpdate.Profesional_TipoSesion.ToList();
            base.EntriesClear();
            entityToUpdate.HorariosProfesionales = horariosProfesionales;
            entityToUpdate.Profesional_TipoSesion = profesional_TipoSesion;

            InsertUpdateOrDeleteTipoSesion(entityToUpdate, entity);
            InsertUpdateOrDeleteAgenda(entityToUpdate, entity);
            InsertOrDeleteHorarios(entityToUpdate, entity);
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

        private void InsertOrDeleteHorarios(Profesional profesionalExisting, Profesional profesional)
        {
            var deleted = profesionalExisting.HorariosProfesionales.Except(profesional.HorariosProfesionales, p => p.ID).ToList();
            deleted.ForEach(s => _dbcontext.Entry(s).State = EntityState.Deleted);
            profesional.HorariosProfesionales.ToList().ForEach(s => {
                s.ProfesionalID = profesional.ID;
                _dbcontext.Entry(s).State = s.ID > 0 ? EntityState.Unchanged : EntityState.Added;
            }
            );
        }
    }
}
