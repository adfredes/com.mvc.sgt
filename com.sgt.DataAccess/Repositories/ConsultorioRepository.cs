using com.sgt.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Repositories
{
    class ConsultorioRepository: GenericRepository<Consultorio>, IConsultorioRepository
    {
        public ConsultorioRepository(DbContext dbContext) : base(dbContext) { }
    }
}
