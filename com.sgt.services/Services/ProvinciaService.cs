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
    public class ProvinciaService : IProvinciaService
    {
        private IUnitOfWork unitOfWork;

        public ProvinciaService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }        

        public ICollection<Provincia> GetAll()
        {
            return this.unitOfWork.RepoProvincia.GetAll().OrderBy(x => x.Descripcion).ToList();                        
        }
    }
}
