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

        [Route("api/grilla/Estados")]
        public IHttpActionResult GetEstados()
        {
            var estados = Mapper.Map<List<SesionEstadoModel>>(agendaService.GetSesionEstados());
            return Ok(estados);
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

            fecha.NextDays(vista =='s'?7:1).ForEach(day =>
            {
                var newDate = new FechaModel();
                newDate.Fecha = day.ToString("dd/MM/yyyy");
                newDate.Name = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(day.DayOfWeek);
                fechas.Add(newDate);
            });            
            return Ok(fechas);
        }

        [Route("api/grilla/Receso/{dia}/{mes}/{anio}/{vista}")]
        public IHttpActionResult GetRecesosGrilla(string dia, string mes, string anio, char vista)
        {
            List<FechaModel> fechas = new List<FechaModel>();
            //DateTime fecha = DateTime.ParseExact(dia + "/" + mes + "/" + anio, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            DateTime desde = Convert.ToDateTime(anio + "/" + mes + "/" + dia);
            DateTime hasta = vista == 's' ? desde.AddDays(7) : desde;
            var recesos = agendaService.SearchRecesos(desde, hasta);

            recesos.ToList().ForEach(receso =>
            {
                DateTime finicio = receso.FechaDesde > desde ? receso.FechaDesde : desde;
                int total = receso.FechaHasta < hasta ? (receso.FechaHasta - finicio).Days : (hasta - finicio).Days;
                total++;
                finicio.NextDays(total).ForEach(day =>
                {
                    var newDate = new FechaModel();
                    newDate.Fecha = day.ToString("dd/MM/yyyy");
                    newDate.Name = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(day.DayOfWeek);
                    fechas.Add(newDate);
                });
            });

            
            return Ok(fechas);
        }

        [Route("api/grilla/Feriado/{dia}/{mes}/{anio}/{vista}")]
        public IHttpActionResult GetFeriadoGrilla(string dia, string mes, string anio, char vista)
        {
            List<FechaModel> fechas = new List<FechaModel>();
            //DateTime fecha = DateTime.ParseExact(dia + "/" + mes + "/" + anio, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            DateTime desde = Convert.ToDateTime(anio + "/" + mes + "/" + dia);
            DateTime hasta = vista == 's' ? desde.AddDays(7) : desde;

            agendaService.SearchFeriado(desde, hasta)
                .ToList()
                .ForEach(feriado => {
                    var newDate = new FechaModel();
                    newDate.Fecha = feriado.Fecha.ToString("dd/MM/yyyy");
                    newDate.Name = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(feriado.Fecha.DayOfWeek);
                    fechas.Add(newDate);
                });           

            return Ok(fechas);
        }

        [Route("api/grilla/Bloqueo/{dia}/{mes}/{anio}/{vista}")]
        public IHttpActionResult GetBloqueosAgendaGrilla(string dia, string mes, string anio, char vista)
        {
            List<FechaModel> fechas = new List<FechaModel>();
            //DateTime fecha = DateTime.ParseExact(dia + "/" + mes + "/" + anio, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            DateTime desde = Convert.ToDateTime(anio + "/" + mes + "/" + dia);
            DateTime hasta = vista == 's' ? desde.AddDays(7) : desde;
            var agenda = agendaService.GetAgenda();
            var bloqueos = agendaService.SearchBloqueos(desde, hasta);

            List<SesionModel> sesiones = new List<SesionModel>();
            bloqueos.ToList().ForEach(bloqueo =>
            {
                DateTime bDesde = desde > bloqueo.FechaDesde ? desde : bloqueo.FechaDesde;
                while(bDesde <= (hasta < bloqueo.FechaHasta ? hasta : bloqueo.FechaHasta))                
                {
                    DateTime HoraDesde =bloqueo.TodoElDia.HasValue ? agenda.HoraDesde :  bloqueo.HoraDesde.Value;
                    DateTime HoraHasta = bloqueo.TodoElDia.HasValue ? agenda.HoraHasta.AddMinutes(agenda.Frecuencia) : bloqueo.HoraHasta.Value;
                    while (HoraDesde.TimeOfDay < HoraHasta.TimeOfDay)
                    {
                        sesiones.Add(new SesionModel
                        {
                            FechaHora = bDesde.AddHours(HoraDesde.Hour).AddMinutes(HoraDesde.Minute),
                            ConsultorioID = bloqueo.ConsultorioId,
                            TurnoSimultaneo = bloqueo.TurnoSimultaneo
                        });
                        HoraDesde = HoraDesde.AddMinutes(agenda.Frecuencia);
                    }
                    bDesde = bDesde.AddDays(1);
                }
                

            });

            return Ok(sesiones);
        }

        [Route("api/grilla/sesiones/{dia}/{mes}/{anio}/{vista}")]
        public IHttpActionResult GetSesionesGrillaByDate(int dia, int mes, int anio, char vista)
        {
            DateTime beginDate = Convert.ToDateTime(anio + "/" + mes + "/" + dia);
            DateTime endDate = vista == 's' ? beginDate.AddDays(7) : beginDate.AddDays(1);
            var sesiones = Mapper.Map<List<SesionGrillaModel>>(agendaService.SearchSesions(beginDate, endDate));
            return Ok(sesiones);
        }

        [Route("api/sesiones/{id}")]
        public IHttpActionResult GetSesion(int id)
        {
            var sesiones = Mapper.Map<List<SesionGrillaModel>>(agendaService.FindSesion(id));
            return Ok(sesiones);
        }

        [HttpGet]
        [Route("api/turno/SinFechaAsignada")]
        public IHttpActionResult TurnoSinFecha()
        {
            var turnos = Mapper.Map<List<TurnoSinFecha>>(agendaService.GetTurnosSinFecha());
            return Ok(turnos);
        }

        [HttpGet]
        [Route("api/turno/enviar/{turnoId}")]        
        public IHttpActionResult SendMailTurno(int turnoId)
        {
            try
            {
                return Ok(agendaService.TurnoSendMail(turnoId));
            }
            catch(Exception ex)
            {
                return BadRequest(ex.ToString());
            }
            
        }

        [HttpPost]
        [Route("api/turno/enviar")]
        public IHttpActionResult SendMailTurnoP(int turnoId)
        {
            try
            {
                return Ok(agendaService.TurnoSendMail(turnoId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }

        }


        [Route("api/grilla/existesesiones/desde/{ddia}/{dmes}/{danio}/hasta/{hdia}/{hmes}/{hanio}")]
        public IHttpActionResult GetExisteSesionessGrillaByDate(int ddia, int dmes, int danio, int hdia, int hmes, int hanio)
        {
            DateTime beginDate = Convert.ToDateTime(danio + "/" + dmes + "/" + ddia);
            DateTime endDate = Convert.ToDateTime(hanio + "/" + hmes + "/" + hdia);                      
            return Ok(agendaService.ExisteSesionesRangoFecha(beginDate, endDate));
        }

    }
}
