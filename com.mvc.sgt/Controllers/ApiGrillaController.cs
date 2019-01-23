using AutoMapper;
using com.mvc.sgt.Models;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using com.sgt.common.util;
using System.Globalization;

namespace com.mvc.sgt.Controllers
{
    public class ApiGrillaController : ApiController
    {
        private IAgendaService agendaService;
        private IConsultorioService consultorioService;



        public ApiGrillaController(IAgendaService agendaService, IConsultorioService consultorioService) {
            this.agendaService = agendaService;
            this.consultorioService = consultorioService;
        }

        [Route("api/grilla/RangoHorario")]
        public IHttpActionResult GetRangoHorario()
        {
            var agenda = agendaService.GetAgenda();
            List<string> horarios = new List<string>();
            DateTime horaInicio = agenda.HoraDesde;
            DateTime horaFin = agenda.HoraHasta;
            while (horaInicio <= horaFin)
            {
                horarios.Add(horaInicio.ToString("HH:mm"));
                horaInicio = horaInicio.AddMinutes(agenda.Frecuencia);
            }
            return Ok(horarios);
        }

        [Route("api/grilla/Consultorios")]
        public IHttpActionResult GetConsultorios()
        {
            var consultorios = Mapper.Map<List<ConsultorioModel>>(consultorioService.GetAll());
            return Ok(consultorios);
        }         
        
        [Route("api/grilla/RangoFecha/{dia}/{mes}/{anio}/{vista}")]
        public  IHttpActionResult GetRangoFecha(string dia, string mes, string anio, char vista)
        {
            List<FechaModel> fechas = new List<FechaModel>();
            //DateTime fecha = DateTime.ParseExact(dia + "/" + mes + "/" + anio, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            DateTime fecha = Convert.ToDateTime(anio + "/" + mes + "/" + dia);

            fecha.NextDays(vista.ToString() =="s"?7:1).ForEach(day =>
            {
                var newDate = new FechaModel();
                newDate.Fecha = day.ToString("dd/MM/yyyy");
                newDate.Name = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(day.DayOfWeek);
                fechas.Add(newDate);
            });            
            return Ok(fechas);

        }

        [Route("api/grilla/sesiones/{dia}/{mes}/{anio}/{vista}")]
        public IHttpActionResult GetSesionesGrillaByDate(int dia, int mes, int anio, char vista)
        {
            DateTime beginDate = Convert.ToDateTime(anio + "/" + mes + "/" + dia);
            DateTime endDate = vista == 's' ? beginDate.AddDays(7) : beginDate.AddDays(1);
            var sesiones = Mapper.Map<List<SesionGrillaModel>>(agendaService.SearchSesions(beginDate, endDate));
            return Ok(sesiones);
        }

    }
}
