using AutoMapper;
using com.mvc.sgt.Controllers.Filters;
using com.mvc.sgt.Models;
using com.sgt.DataAccess;
using com.sgt.services.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace com.mvc.sgt.Controllers
{
   [Authorize]
    public class AgendaController : Controller
    {
        IAgendaService AgendaService;
        public AgendaController(IAgendaService AgendaService)
        {
            this.AgendaService = AgendaService;
        }


        // GET: Agenda
        public ActionResult Index()
        {
            return PartialView();
        }

        //public ActionResult Diaria(DateTime fecha)
        //{
        //    return PartialView();
        //}

        public ActionResult Semanal()
        {
            //var agenda = Mapper.Map<AgendaModel>(this.AgendaService.GetAgenda());
            return PartialView();
        }

        public ActionResult Feriados()
        {
            return PartialView();
        }

        [Route("Agenda/Feriados/Listar")]
        public JsonResult ListarFeriados()
        {
            return Json(this.AgendaService.FindNextFeriado(), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult CreateOrEditFeriado(int? id)
        {
            return PartialView();
        }

        [HttpGet]
        [Route ("Sesion/ChangeDateModal")]
        public ActionResult CambiarFechaSesion()
        {
            return PartialView();
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        public JsonResult CreateOrEditFeriado(FeriadoModel model)
        {
            string resu;
            try
            {
                if (model.ID.HasValue)
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    this.AgendaService.EditFeriado(Mapper.Map<Feriado>(model));
                }
                else
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    this.AgendaService.AddFeriado(Mapper.Map<Feriado>(model));
                }
                resu = "";
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                resu = ex.Message;
            }

            return Json(resu);
        }

        [HttpPut]
        [Route("Sesion/Estado/Confirmar")]
        public JsonResult setSesionConfirmo(int id)
        {
            SesionGrillaModel resu;
            try
            {
                resu = Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionConfirmado(id, User.Identity.Name ?? "admin"));
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                resu = new SesionGrillaModel();
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [Route("Sesion/Pendiente/Anular")]
        public JsonResult AnularSesionesPendientes(int id)
        {
            string resu;            
            try
            {
                var turno = this.AgendaService.CancelarSesionesPendientes(id);
                Response.StatusCode = (int)HttpStatusCode.OK;
                resu = JsonConvert.SerializeObject(Mapper.Map<TurnoModel>(turno));
            }
            catch(Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                resu = ex.Message;
            }
            return Json(resu, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [Route("Sesion/Estado/Anular")]
        public JsonResult setSesionAnulada(int id)
        {
            SesionGrillaModel resu;
            try
            {
                resu = Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionAnulada(id, User.Identity.Name ?? "admin"));
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                resu = new SesionGrillaModel();
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [Route("Sesion/Estado/Asistio")]
        public JsonResult setSesionAsistio(int id)
        {
            SesionGrillaModel resu;
            try
            {
                resu = Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionAsistio(id, User.Identity.Name ?? "admin"));
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                resu = new SesionGrillaModel();
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [Route("Sesion/Estado/NoAsistio")]
        public JsonResult setSesionNoAsistio(int id)
        {
            SesionGrillaModel resu;
            try
            {
                resu = Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionNoAsistio(id, User.Identity.Name ?? "admin"));
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                resu = new SesionGrillaModel();
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [Route("Sesion/Estados/Asistio")]
        public JsonResult setSesionesAsistio(List<int> ids)
        {
            List<SesionGrillaModel> resu = new List<SesionGrillaModel>();
            try
            {
                ids.ForEach(id =>
                {
                    resu.Add(Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionAsistio(id, User.Identity.Name ?? "admin")));
                });                
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {                
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [Route("Sesion/Estados/NoAsistio")]
        public JsonResult setSesionesNoAsistio(List<int> ids)
        {
            List<SesionGrillaModel> resu = new List<SesionGrillaModel>();
            try
            {
                ids.ForEach(id =>
                {
                    resu.Add(Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionNoAsistio(id, User.Identity.Name ?? "admin")));
                });
                
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        public JsonResult BloquearSesion(TurnoModel model)
        {
            try
            {
                var sesiones = Mapper.Map<List<SesionGrillaModel>>(this.AgendaService.BloquearSesion(Mapper.Map<Turno>(model)));
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(JsonConvert.SerializeObject(sesiones), JsonRequestBehavior.AllowGet);
                //return Json(sesiones);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }


        }

        [HttpPost]
        [Route("Sesion/Reservar")]
        [CreateUpdateActionFilter("admin")]
        public JsonResult ReservarSesion(TurnoModel model)
        {
            try
            {
                var sesiones = Mapper.Map<TurnoModel>(this.AgendaService.ReservarSesiones(Mapper.Map<Turno>(model)));
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(sesiones);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }


        }

        [HttpDelete]
        [Route("Sesion/Reserva/Delete")]
        public JsonResult CancelarReserva(int turnoID)
        {
            try
            {
                this.AgendaService.CancelarReserva(turnoID);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json("ok");
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.NotFound;
                return Json(ex.Message);
            }
        }

        [HttpPut]
        [CreateUpdateActionFilter("admin")]
        [Route("Sesion/CambiarFecha/SobreTurno")]
        public JsonResult ModificarSesionSobreturno(List<SesionModel> model)
        {
            try
            {
                var sesiones = Mapper.Map<ICollection<Sesion>>(model);
                sesiones = this.AgendaService.CambiarFechaSesionSobreturno(sesiones);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(sesiones);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }
        }

        [HttpPut]
        [CreateUpdateActionFilter("admin")]
        [Route("Sesion/CambiarFecha")]
        public JsonResult ModificarSesion(List<SesionModel> model)
        {
            try
            {
                var sesiones = Mapper.Map<ICollection<Sesion>>(model);
                sesiones = this.AgendaService.CambiarFechaSesion(sesiones);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(sesiones);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }
        }

        [HttpPut]
        [CreateUpdateActionFilter("admin")]
        [Route("Sesion/Posponer")]
        public JsonResult PosponerSesion(List<SesionModel> model)
        {
            try
            {
                var sesiones = Mapper.Map<ICollection<Sesion>>(model);
                sesiones = this.AgendaService.PosponerSesion(sesiones);                
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(sesiones);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }
        }



        [HttpGet]
        [Route("Sesion/ChangeDate")]
        public ActionResult EditSesion()
        {
            return PartialView();
        }

        [HttpPut]
        [Route("Turno/AgregarSesiones")]
        public JsonResult AgregarSesiones(Turno model)
        {
            try
            {
                var turno = Mapper.Map<Turno>(model);
                this.AgendaService.AgregarSesiones(turno,true);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json("ok");
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }
        }

        [HttpGet]
        [Route("Turno/AsignarPaciente")]
        public ActionResult AsignarPacienteView()
        {
            return PartialView();
        }

        [HttpPut]
        [Route("Turno/Diagnostico")]
        [CreateUpdateActionFilter("admin")]
        public JsonResult SetDiagnosticoTurno(TurnoModel model)
        {
            try
            {
                var turno = Mapper.Map<Turno>(model);
                this.AgendaService.EditDiagnosticoTurno(turno);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json("ok");
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }
        }

        [HttpPut]
        [Route("Turno/Confirmar")]
        [CreateUpdateActionFilter("admin")]
        public JsonResult ConfirmarTurno(TurnoModel model)
        {
            try
            {
                var turno = Mapper.Map<Turno>(model);
                turno = this.AgendaService.ConfirmarTurno(turno);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(JsonConvert.SerializeObject(Mapper.Map<TurnoModel>(turno)));
            }
            catch(Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }
        }

        [HttpPut]
        [Route("Turno/AsignarPaciente")]
        [CreateUpdateActionFilter("admin")]
        public ActionResult AsignarPaciente(TurnoModel model)
        {
            try
            {
                var turno = Mapper.Map<Turno>(model);
                this.AgendaService.AsignarPacienteTurno(turno);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(JsonConvert.SerializeObject(Mapper.Map<TurnoModel>(turno)));
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }
        }

        [HttpGet]
        [Route("Turno/{id}")]
        public JsonResult GetTurno(int id)
        {
            TurnoModel turno = null;            
            turno = Mapper.Map<TurnoModel>(this.AgendaService.GetTurno(id));            
            return Json(JsonConvert.SerializeObject(turno), JsonRequestBehavior.AllowGet);
            //return Json(turnos, JsonRequestBehavior.AllowGet);
        }

    }
}