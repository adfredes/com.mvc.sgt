using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using com.sgt.DataAccess.Interfaces;


namespace com.sgt.DataAccess.Repositories
{
    public class TurnoRepository: GenericRepository<Turno>, ITurnoRepository
    {
        public TurnoRepository(DbContext dbContext) : base(dbContext) { }
    }
}
