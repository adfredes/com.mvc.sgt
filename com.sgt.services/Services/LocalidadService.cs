using com.sgt.DataAccess;
using com.sgt.DataAccess.Interfaces;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Services
{
    public class LocalidadService : ILocalidadService
    {
        private IUnitOfWork unitOfWork;

        public LocalidadService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public ICollection<Localidad> getByProvincia(int idProvincia)
        {
            return this.unitOfWork.RepoLocalidad.GetAll()
                    .Where(l => l.ProvinciaID == idProvincia)
                    .OrderBy(l => l.Descripcion)
                    .ToList();
        }
    }
}
