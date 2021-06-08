using AutoMapper;
using com.mvc.sgt.Models;
using com.mvc.sgt.Models.DTO;
using com.sgt.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using com.sgt.DataAccess.Enums;

namespace com.mvc.sgt.App_Start
{
    public class AutoMapperConfig
    {
        public static void RegisterMappers()
        {            
            Mapper.Initialize(mapper =>
            {
                

                mapper.CreateMap<Aseguradora, AseguradoraModel>()
                .ForMember(d=>d.AseguradoraPlan, opt=> opt.MapFrom(src=> src.Aseguradora_Plan))
                .ReverseMap();
                mapper.CreateMap<Aseguradora, ComboDTO>()
                .ForMember(d => d.Value, opt => opt.MapFrom(src => src.ID))
                .ForMember(d => d.Text, opt => opt.MapFrom(src => src.Descripcion))
                .ReverseMap();

                mapper.CreateMap<AseguradoraPlanModel, Aseguradora_Plan>()
                .ReverseMap();
                mapper.CreateMap<Aseguradora_Plan, ComboDTO>()
                .ForMember(d => d.Value, opt => opt.MapFrom(src => src.ID))
                .ForMember(d => d.Text, opt => opt.MapFrom(src => src.Descripcion))
                .ReverseMap();

                mapper.CreateMap<Turno, TurnoFacturacionModel>()
                .ForMember(d => d.Aseguradora, opt => opt.MapFrom(src => src.Paciente.Aseguradora.Descripcion))
                .ForMember(d => d.AseguradoraPlan, opt => opt.MapFrom(src => src.Paciente.Aseguradora_Plan.Descripcion))
                .ForMember(d => d.Cuit, opt => opt.MapFrom(src=>src.Paciente.Cuit))                
                .ForMember(d => d.DocumentoNumero, opt => opt.MapFrom(src => src.Paciente.DocumentoNumero))
                .ForMember(d => d.Nombre, opt => opt.MapFrom(src => src.Paciente.Nombre))
                .ForMember(d => d.Apellido, opt => opt.MapFrom(src => src.Paciente.Apellido))
                .ForMember(d => d.Direccion, opt => opt.MapFrom(src => src.Paciente.Direccion))
                .ForMember(d => d.CodigoPostal, opt => opt.MapFrom(src => src.Paciente.CodigoPostal))
                .ForMember(d => d.NumeroAfiliado, opt => opt.MapFrom(src => src.Paciente.NumeroAfiliado))
                ;

                mapper.CreateMap<Turno, TurnoListModel>()
                .ForMember(d => d.FechaDesde,
                o => o.MapFrom(s => s.Sesions
                    .Where(t => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)t.Estado) || EstadoSesion.SinFechaLibre == (EstadoSesion)t.Estado)
                    .Min( t => t.FechaHora)))
                .ForMember(d => d.FechaHasta,
                o => o.MapFrom(s => s.Sesions
                    .Where(t => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)t.Estado) || EstadoSesion.SinFechaLibre == (EstadoSesion)t.Estado)
                    .Max(t => t.FechaHora)))                
                ;

                mapper.CreateMap<Paciente, PacienteSearchDto>()                
                .ReverseMap();

                //mapper.CreateMap<Paciente, PacienteDto>()
                //.ForMember(d => d.DocumentoTipoID, opt => opt.MapFrom(src => src.Documento_Tipo.ID))
                //.ForMember(d => d.AseguradoraPlanID, opt => opt.MapFrom(src => src.Aseguradora_Plan.ID))
                //.ForMember(d => d.ProvinciaID, opt => opt.MapFrom(src => src.Provincia.ID))
                //.ForMember(d => d.LocalidadID, opt => opt.MapFrom(src => src.Localidad.ID))
                //.ReverseMap();

                mapper.CreateMap<PacienteDto, Paciente>()                
                .ReverseMap();

                mapper.CreateMap<Paciente, PacienteModel>()
                .ForMember(d => d.DocumentoTipo, opt => opt.MapFrom(src => src.Documento_Tipo))
                .ForMember(d=> d.AseguradoraPlan, opt => opt.MapFrom(src => src.Aseguradora_Plan))
                .ForMember(d=>d.Provincia, opt => opt.MapFrom(src=>src.Provincia))
                .ForMember(d => d.Localidad, opt => opt.MapFrom(src => src.Localidad))
                .ReverseMap();

                mapper.CreateMap<Documento_Tipo, DocumentoTipoModel>()
                .ReverseMap();

                mapper.CreateMap<Documento_Tipo, ComboDTO>()
                .ForMember(d=> d.Value , opt => opt.MapFrom(src=>src.ID))
                .ForMember(d => d.Text, opt => opt.MapFrom(src => src.Descripcion))
                .ReverseMap();

                mapper.CreateMap<Localidad, LocalidadModel>()
                .ReverseMap();
                mapper.CreateMap<Localidad, ComboDTO>()
                .ForMember(d => d.Value, opt => opt.MapFrom(src => src.ID))
                .ForMember(d => d.Text, opt => opt.MapFrom(src => src.Descripcion))
                .ReverseMap();

                mapper.CreateMap<Provincia, ProvinciaModel>()
                .ReverseMap();
                mapper.CreateMap<Provincia, ComboDTO>()
                .ForMember(d => d.Value, opt => opt.MapFrom(src => src.ID))
                .ForMember(d => d.Text, opt => opt.MapFrom(src => src.Descripcion))
                .ReverseMap();

                mapper.CreateMap<Feriado, FeriadoModel>()
                .ReverseMap();

                mapper.CreateMap<Consultorio, ConsultorioModel>()
                .ForMember(d => d.Color, opt => opt.MapFrom(src => src.TipoSesion.Color))
                .ForMember(d=> d.TipoDeSesion, o=>o.MapFrom(s => s.TipoSesion.Descripcion));
                mapper.CreateMap<ConsultorioModel, Consultorio>();

                mapper.CreateMap<Consultorio, ConsultorioHorariosModel>()
                .ReverseMap();

                mapper.CreateMap<Sesion, SesionGrillaModel>()
                .ForMember(d => d.Aseguradora, o => o.MapFrom(s => s.Turno.Paciente.Aseguradora.Descripcion))
                .ForMember(d => d.AseguradoraColor, o => o.MapFrom(s => s.Turno.Paciente.Aseguradora.Color))
                .ForMember(d => d.Paciente, o => o.MapFrom(s => s.Turno.Paciente.Apellido + ' ' + s.Turno.Paciente.Nombre))
                .ForMember(d => d.PacienteId, o => o.MapFrom(s => s.Turno.Paciente.ID))
                .ForMember(d => d.CantidadSesiones, o => o.MapFrom(s => s.Turno.CantidadSesiones))
                .ForMember(d => d.EstadoTurno, o => o.MapFrom(s => s.Turno.Estado))
                .ForMember(d => d.Diagnostico, o => o.MapFrom(s => s.Turno.TipoSesion.Descripcion + ": " + s.Turno.Diagnostico))
                .ForMember(d => d.Plan, o => o.MapFrom(s => s.Turno.Paciente.Aseguradora_Plan.Descripcion))
                .ForMember(d => d.Observaciones, o => o.MapFrom(s => s.Turno.Paciente.Observaciones))
                .ForMember(d => d.TurnoDoble, o => o.MapFrom(s => s.Turno.TurnoDoble))
                .ForMember(d => d.DobleOrden, o => o.MapFrom(s => s.Turno.TurnoDoble.HasValue && s.Turno.TurnoDoble.Value > 0 ? true : false))
                .ForMember(d => d.NumeroAutorizacion, o => o.MapFrom(s => s.Turno.NumeroAutorizacion))

                .ForMember(d => d.ProximaSesion, o => o.MapFrom(s => s.Turno.Sesions.OrderBy(se => se.Numero).ThenBy(se => se.FechaHora)
                     .FirstOrDefault(se => se.Numero > s.Numero && EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)se.Estado)).FechaHora))
                .ForMember(d => d.SinAsignar, o => o.MapFrom(s => s.Turno.Sesions
                    .Where(se => (EstadoSesion)se.Estado == EstadoSesion.SinFechaLibre)
                    .Count() > 0 ? true : false));                
                //.ForMember(d => d.SinAsignar, o => o.MapFrom(s => s.Turno.Paciente.Turnoes
                //    .Where(t=> t.Sesions
                //        .Where(se=> (EstadoSesion)se.Estado == EstadoSesion.SinFechaLibre).Count()>0)
                //    .Count() > 0? true:false));


                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                mapper.CreateMap<TipoSesion, ComboDTO>()
                .ForMember(d => d.Value, o => o.MapFrom(s => s.ID))
                .ForMember(d => d.Text, o => o.MapFrom(s => s.Descripcion));

                mapper.CreateMap<Profesional_TipoSesion, Profesional_TipoSesionModel>()
                .ReverseMap();

                mapper.CreateMap<ProfesionalHorariosModel, HorariosProfesionale>()
                .ReverseMap();

                mapper.CreateMap<Profesional, ProfesionalModel>()
                .ForMember(d => d.TiposDeSesiones, o => o.MapFrom(s => s.Profesional_TipoSesion))
                .ForMember(d=> d.Agenda, o => o.MapFrom(s => s.Agenda))
                .ForMember(d => d.Horarios, o => o.MapFrom(s => s.HorariosProfesionales))
                .ReverseMap();

                mapper.CreateMap<Profesional, ComboDTO>()
                .ForMember(d => d.Value, opt => opt.MapFrom(src => src.ID))
                .ForMember(d => d.Text, opt => opt.MapFrom(src => src.Nombre + " " + src.Apellido))
                .ReverseMap();

                mapper.CreateMap<Agendum, AgendaModel>()                
                .ReverseMap();

                mapper.CreateMap<AgendaRecesoModel, Agenda_Receso>()
                .ReverseMap();

                mapper.CreateMap<Agenda_Bloqueos, AgendaBloqueosModel>()
                .ForMember(d => d.Consultorio, o => o.MapFrom(s => s.Consultorio.Descripcion));

                mapper.CreateMap<AgendaBloqueosModel, Agenda_Bloqueos>()                
                .ForMember(d => d.Consultorio, o => o.Ignore());
                

                mapper.CreateMap<Sesion, SesionModel>()
                .ReverseMap();

                mapper.CreateMap<Turno, TurnoModel>()
                .ForMember(d => d.Sesions, o => o.MapFrom(s => s.Sesions.Where(x=> x.Numero > 0)))
                .ReverseMap();

                mapper.CreateMap<Turno, TurnoSinFecha>()
                .ForMember(d => d.Paciente, o => o.MapFrom(s => s.Paciente.Apellido + ", " + s.Paciente.Nombre));

                mapper.CreateMap<Imagen, ImagenModel>()
                .ReverseMap();

                mapper.CreateMap<Imagen, ImagenDescriptionModel>()
                .ReverseMap();                

                mapper.CreateMap<Profesional_Ausencias, ProfesionalAusenciaModel>()
                .ForMember(d => d.Profesional, o => o.MapFrom(s => s.Profesional.Nombre + " " + s.Profesional.Apellido));

                mapper.CreateMap<ProfesionalAusenciaModel, Profesional_Ausencias>()
                .ForMember(d => d.Profesional, o => o.Ignore());

                mapper.CreateMap<ProfesionalSuplenciaModel, Profesional_Suplencias>()
                .ForMember(d => d.Profesional, o => o.Ignore());

                mapper.CreateMap<Profesional_Suplencias, ProfesionalSuplenciaModel>()
                .ForMember(d => d.Profesional, o => o.MapFrom(s => s.Profesional.Nombre + " " + s.Profesional.Apellido));

                mapper.CreateMap<Profesional_Ausencias, AusenciasSuplenciasModel>()
                .ForMember(d => d.Profesional, o => o.MapFrom(s => s.Profesional.Nombre + " " + s.Profesional.Apellido))
                .ForMember(d => d.Suplencias, o => o.MapFrom(s => s.Profesional_Suplencias));

            });
        }
    }

  
}