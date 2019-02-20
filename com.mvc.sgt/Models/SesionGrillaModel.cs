using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class SesionGrillaModel
    {
        public int ID { get; set; }
        public int AgendaID { get; set; }
        public int TurnoID { get; set; }
        public int EstadoTurno { get; set; }
        public short Numero { get; set; }
        public int CantidadSesiones { get; set; }
        public string Diagnostico { get; set; }

        public int ConsultorioID { get; set; }
        public short TurnoSimultaneo { get; set; }
        public short Estado { get; set; }
        public System.DateTime FechaHora { get; set; }                

        public int PacienteId { get; set; }
        public string Paciente { get; set; }
        public string Aseguradora { get; set; }
        public string Plan { get; set; }
        public string AseguradoraColor { get; set; }
        public bool SinAsignar { get; set; }

    }
}