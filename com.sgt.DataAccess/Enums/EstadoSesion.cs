using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Enums
{
    public enum EstadoSesion:short
    {                    
            Reservado = (short) 1,
            Confirmado,
            Anulado,
            Atendido,
            NoAsistio,
            Cancelado,
            Bloqueado,
            SinFechaLibre,
            PospuestoPreAviso,
            PospuestoEnElDia,
            PospuestoConsultorio,
            PospuestoNoAviso

    }
}
