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
    public class DocumentoTipoService : IDocumentoTipoService
    {
        private IUnitOfWork unitOfWork;

        public DocumentoTipoService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public ICollection<Documento_Tipo> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}
