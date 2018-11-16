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
    public class ConsultorioService : IConsultorioService
    {
        private IUnitOfWork unitOfWork;

        public ConsultorioService(IUnitOfWork unitOfWork) =>
            this.unitOfWork = unitOfWork;
        

        public void Add(Consultorio entity)
        {
            this.unitOfWork.RepoConsultorio.Add(entity);
        }
        

        public void Delete(Consultorio entity)
        {
            entity.Habilitado = false;
            Edit(entity);
        }

        public void Edit(Consultorio entity)
        {
            this.unitOfWork.RepoConsultorio.Edit(entity);
        }

        public Consultorio Find(int id) => 
            this.unitOfWork.RepoConsultorio.Find(id);

        public IQueryable<Consultorio> FindBy(Expression<Func<Consultorio, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public ICollection<Consultorio> GetAll() =>
            this.unitOfWork.RepoConsultorio.GetAll().OrderBy(x => x.Descripcion).ToList();

        public List<TipoSesion> GetAllTipoSesion() =>
            this.unitOfWork.RepoTipoSesion.GetAll().OrderBy(x => x.Descripcion).ToList();
        
    }
}
