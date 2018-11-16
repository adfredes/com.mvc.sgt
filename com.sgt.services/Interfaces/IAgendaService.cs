using com.sgt.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Interfaces
{
    public interface IAgendaService
    {
        void AddFeriado(Feriado entity);
        void DelFeriado(Feriado entity);
        void DelFeriado(int id);
        void EditFeriado(Feriado entity);        
        Feriado FindFeriado(int id);
        ICollection<Feriado> FindNextFeriado();

    }
}
