//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace com.sgt.DataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class Profesional_Suplencias
    {
        public int ID { get; set; }
        public int ProfesionalID { get; set; }
        public int AusenciaID { get; set; }
        public Nullable<int> DiaSemana { get; set; }
        public System.DateTime HoraDesde { get; set; }
        public System.DateTime HoraHasta { get; set; }
        public Nullable<bool> Habilitado { get; set; }
    
        public virtual Profesional Profesional { get; set; }
        public virtual Profesional_Ausencias Profesional_Ausencias { get; set; }
    }
}
