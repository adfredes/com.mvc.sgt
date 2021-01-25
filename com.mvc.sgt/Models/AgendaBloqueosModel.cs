using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class AgendaBloqueosModel
    {
        public int ID { get; set; }
        public int AgendaId { get; set; }
        public int ConsultorioId { get; set; }
        public short TurnoSimultaneo { get; set; }
        public System.DateTime FechaDesde { get; set; }
        public System.DateTime FechaHasta { get; set; }
        public Nullable<System.DateTime> HoraDesde { get; set; }
        public Nullable<System.DateTime> HoraHasta { get; set; }
        public Nullable<bool> TodoElDia { get; set; }
        public bool Habilitado { get; set; }
        public bool bLunes { get; set; }
        public bool bMartes { get; set; }
        public bool bMiercoles { get; set; }
        public bool bJueves { get; set; }
        public bool bViernes { get; set; }
        public bool bSabado { get; set; }
        public bool bDomingo { get; set; }

        public string Consultorio { get; set; }
    }
}