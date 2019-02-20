using AutoMapper;
using com.mvc.sgt.Models;
using com.sgt.DataAccess;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using com.mvc.sgt.Controllers.Filters;
using com.sgt.DataAccess.Enums;
using com.sgt.DataAccess.ExtensionMethod;

namespace com.mvc.sgt.Controllers
{
    public class ConsultorioController : Controller
    {
        private IConsultorioService consultorioService;
        private IAgendaService agendaService;

        public ConsultorioController(IConsultorioService consultorioService, IAgendaService agendaService)
        {
            this.agendaService = agendaService;
            this.consultorioService = consultorioService;
        }

        // GET: Consultorio
        public ActionResult Index()
        {
            return PartialView();
        }

        public ActionResult CreateOrEdit()
        {
            return PartialView();
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        public JsonResult CreateOrEdit(ConsultorioModel model)
        {           
            
            string resu;
            try
            {
                if (model.ID.HasValue)
                {
                    this.consultorioService.Edit(Mapper.Map<Consultorio>(model));
                }
                else {
                    this.consultorioService.Add(Mapper.Map<Consultorio>(model));
                }
                resu = "ok";
            }catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                resu = ex.Message;
            }

            return Json("");
        }

        [Route("Consultorio/Listar")]
        public JsonResult GetConsultorios()
        {
            var model = Mapper.Map<List<ConsultorioModel>>(this.consultorioService.GetAll());
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [Route("Consultorio/ListarHorarios/{anio}/{mes}/{dia}")]
        public JsonResult GetConsultoriosHorarios(string anio, string mes, string dia)
        {
            DateTime fecha = Convert.ToDateTime(anio + "/" + mes + "/" + dia);
            var model = Mapper.Map<List<ConsultorioHorariosModel>>(consultorioService.GetAll());

            var agenda = agendaService.GetAgenda();
            var sesiones = agendaService.SearchSesions(fecha, fecha.AddDays(1));
            List <string> horarios = new List<string>();            
            DateTime horaInicio = agenda.HoraDesde;
            DateTime horaFin = agenda.HoraHasta;
            while (horaInicio <= horaFin)
            {
                horarios.Add(horaInicio.ToString("HH:mm"));
                horaInicio = horaInicio.AddMinutes(agenda.Frecuencia);
            }

            model.ForEach(consultorio =>
            {
                for(int ts = 1; ts <= consultorio.TurnosSimultaneos; ts++)
                {
                    var horariosTomados = sesiones
                    .Where(x => x.ConsultorioID == consultorio.ID && x.TurnoSimultaneo == ts)
                    .Select(y => y.FechaHora.ToString("HH:mm"))
                    .ToList();

                    horarios
                        .Where(x => !horariosTomados.Contains(x) && !consultorio.Horario.Contains(x))
                        .ToList()
                        .ForEach(hr =>
                        {
                            consultorio.Horario.Add(hr);
                        });                    
                }
                consultorio.Horario = consultorio.Horario.OrderBy(x => x).ToList();
                
            });

            return Json(model,JsonRequestBehavior.AllowGet);
        }
    }
}