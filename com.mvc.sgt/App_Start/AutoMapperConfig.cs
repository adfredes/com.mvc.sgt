using AutoMapper;
using com.mvc.sgt.Models;
using com.sgt.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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

                mapper.CreateMap<AseguradoraPlanModel, Aseguradora_Plan>()
                .ReverseMap();

                mapper.CreateMap<Paciente, PacienteModel>()
                .ForMember(d => d.DocumentoTipo, opt => opt.MapFrom(src => src.Documento_Tipo))
                .ForMember(d=> d.AseguradoraPlan, opt => opt.MapFrom(src => src.Aseguradora_Plan))
                .ReverseMap();

                mapper.CreateMap<Documento_Tipo, DocumentoTipoModel>()
                .ReverseMap();

                mapper.CreateMap<Localidad, LocalidadModel>()
                .ReverseMap();

                mapper.CreateMap<Provincia, ProvinciaModel>()
                .ReverseMap();
                
            });
        }
    }

  
}