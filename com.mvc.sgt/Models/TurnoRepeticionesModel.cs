using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class TurnoRepeticionesModel
    {
         
        public int? ID { get; set; }
        public int TurnoID { get; set; }
        public int Posicion { get; set; }
        public int DiaSemana { get; set; }
        public int ConsultorioID { get; set; }
        public System.DateTime Hora { get; set; }
        public int Frecuencia { get; set; }
        public string UsuarioModificacion { get; set; }
        public string NumeroAutorizacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
            
    }
}