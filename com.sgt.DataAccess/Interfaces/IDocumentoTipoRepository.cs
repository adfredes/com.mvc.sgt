using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Interfaces
{
    public interface IDocumentoTipoRepository
    {
        IQueryable<Documento_Tipo> GetAll();
    }
}
