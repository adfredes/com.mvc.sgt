using com.sgt.DataAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Repositories
{
    public class AseguradoraRepository : GenericRepository<Aseguradora>, IAseguradoraRepository
    {
        public AseguradoraRepository(DbContext dbContext) : base(dbContext) { }

        public override void Edit(Aseguradora entity)
        {
            _dbcontext.Entry(entity).State = EntityState.Modified;
            foreach (var np in entity.Aseguradora_Plan)
            {
                np.FechaModificacion = DateTime.Now;
                np.AseguradoraID = entity.ID;                
                np.UsuarioModificacion = entity.UsuarioModificacion;
                _dbcontext.Entry(np).State = np.ID > 0 ? EntityState.Modified : EntityState.Added;
            }


            Save();
        }
    }
}
