using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class SesionModel
    {
        public int? ID { get; set; }
        public int AgendaID { get; set; }
        public int TurnoID { get; set; }
        public short Numero { get; set; }
        public int ConsultorioID { get; set; }
        public short TurnoSimultaneo { get; set; }
        public short Estado { get; set; }
        public System.DateTime FechaHora { get; set; }
        public Nullable<bool> FueDobleOrden { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
        
    }
}