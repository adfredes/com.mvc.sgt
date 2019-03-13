using com.sgt.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Repositories
{
    public class TurnoRepeticionesRepository : GenericRepository<Turno_Repeticiones>, ITurnoRepeticionesRepository
    {
        public TurnoRepeticionesRepository(DbContext dbContext) : base(dbContext) { }
    }
}
