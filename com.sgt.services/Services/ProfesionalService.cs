using com.sgt.DataAccess;
using com.sgt.DataAccess.Interfaces;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Services
{
    public class ProfesionalService : IProfesionalService
    {
        private IUnitOfWork unitOfWork;

        public ProfesionalService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void Add(Profesional entity)
        {
            entity = SetAgendaFechaUsuario(entity);
            this.unitOfWork.RepoProfesional.Add(entity);
        }

        public void Delete(Profesional entity)
        {
            entity.Habilitado = false;
            Edit(entity);
        }

        public void Edit(Profesional entity)
        {
            entity = SetAgendaFechaUsuario(entity);
            this.unitOfWork.RepoProfesional.Edit(entity);
        }

        private Profesional SetAgendaFechaUsuario(Profesional entity)
        {
            entity.Agenda.ToList().ForEach(a => {
                    a.UsuarioModificacion = entity.UsuarioModificacion;
                a.FechaModificacion = entity.FechaModificacion; 
                });
            return entity;
        }
        

        public Profesional Find(int id)
        {
            return unitOfWork.RepoProfesional.Find(id);
        }

        public IQueryable<Profesional> FindBy(Expression<Func<Profesional, bool>> predicate)
        {
            return unitOfWork.RepoProfesional.FindBy(predicate);
        }

        public ICollection<Profesional> GetAll()
        {
            return unitOfWork.RepoProfesional.GetAll().ToList();
        }

       
        public ICollection<Profesional> GetAll(int page, int count)
        {            
            return unitOfWork.RepoProfesional.GetAll().
                OrderBy(x => x.Apellido).
                ThenBy(x => x.Nombre).
                Skip((page - 1) * count).
                Take(count).
                ToList();
            
        }

        
        public ICollection<Profesional> FindByLetter(string letter, int page, int count)
        {            
                return FindBy(x => x.Apellido.Substring(0, 1).ToUpper() == letter)                
                .OrderBy(x => x.Apellido).
                ThenBy(x => x.Nombre).
                Skip((page - 1) * count).
                Take(count)
                .ToList();            
        }
    }
}
