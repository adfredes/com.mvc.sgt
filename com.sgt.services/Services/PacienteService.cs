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
    class PacienteService : IPacienteService
    {
        private IUnitOfWork unitOfWork;

        public PacienteService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void Add(Paciente entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(Paciente entity)
        {
            throw new NotImplementedException();
        }

        public void Edit(Paciente entity)
        {
            throw new NotImplementedException();
        }

        public Paciente Find(int id)
        {
            throw new NotImplementedException();
        }

        public IQueryable<Paciente> FindBy(Expression<Func<Paciente, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public ICollection<Paciente> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}
