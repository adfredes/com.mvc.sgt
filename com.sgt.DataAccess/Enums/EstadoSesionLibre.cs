using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Enums
{
    public class EstadoSesionCondicion
    {
        public static List<EstadoSesion> Libre = new List<EstadoSesion>()
    {      
      EstadoSesion.Anulado,
      EstadoSesion.Cancelado,
      EstadoSesion.SinFechaLibre,
      EstadoSesion.PospuestoConsultorio,
      EstadoSesion.PospuestoEnElDia,
      EstadoSesion.PospuestoNoAviso,
      EstadoSesion.PospuestoPreAviso
            
    };
        public static List<EstadoSesion> Ocupado = new List<EstadoSesion>()
    {
      EstadoSesion.Reservado,
      EstadoSesion.Confirmado,
      EstadoSesion.Atendido,
      EstadoSesion.Bloqueado,
      EstadoSesion.NoAsistio
    };
    }
}
