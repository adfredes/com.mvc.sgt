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
    public class AseguradoraService: IAseguradoraService
    {
        private IUnitOfWork unitOfWork;

        public AseguradoraService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void Add(Aseguradora entity)
        {
            entity.Aseguradora_Plan.ToList().ForEach(p =>
            {
                p.UsuarioModificacion = entity.UsuarioModificacion;
                p.FechaModificacion = entity.FechaModificacion;
            });
            unitOfWork.RepoAseguradora.Add(entity);
        }

        public void Delete(Aseguradora entity)
        {
            throw new NotImplementedException();
        }

        public void Edit(Aseguradora entity)
        {
            unitOfWork.RepoAseguradora.Edit(entity);
        }

        public Aseguradora Find(int id)
        {
            return unitOfWork.RepoAseguradora.Find(id);
        }

        public IQueryable<Aseguradora> FindBy(Expression<Func<Aseguradora, bool>> predicate)
        {
            return unitOfWork.RepoAseguradora.FindBy(predicate);
        }

        public ICollection<Aseguradora> GetAll()
        {
            return unitOfWork.RepoAseguradora.GetAll().ToList();
        }
    }
}
