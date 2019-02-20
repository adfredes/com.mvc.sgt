using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Enums
{
    public enum EstadoTurno:short
    {        
        Reservado = 1,
        Confirmado,
        Bloqueado,
        Cancelado
    }
}
