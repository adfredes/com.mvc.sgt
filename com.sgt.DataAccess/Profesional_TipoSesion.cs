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
    
    public partial class Profesional_TipoSesion
    {
        public int ID { get; set; }
        public int ProfesionalID { get; set; }
        public int TipoSesionID { get; set; }
    
        public virtual Profesional Profesional { get; set; }
        public virtual TipoSesion TipoSesion { get; set; }
    }
}