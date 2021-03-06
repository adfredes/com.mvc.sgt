﻿using AutoMapper;
using com.mvc.sgt.Controllers.Filters;
using com.mvc.sgt.Models;
using com.mvc.sgt.Models.DTO;
using com.sgt.DataAccess;
using com.sgt.DataAccess.Enums;
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

        [Route("Agenda/Feriados")]
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
        [Route("Sesion/EsDoble")]
        public JsonResult setSesionEsDoble(int id, bool esDoble)
        {
            SesionGrillaModel resu;
            try
            {
                resu = Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionEsDoble(id,esDoble));
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                resu = new SesionGrillaModel();
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
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
                var turno = this.AgendaService.CancelarSesionesPendientes(id,User.Identity.Name);
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

        //trabajado
        [HttpPut]
        [Route("Sesion/Siguientes/Anular")]
        public JsonResult AnularSesionesSiguientes(int id)
        {
            string resu;
            try
            {
                var turno = this.AgendaService.CancelarSesionesSiguientes(id, User.Identity.Name);
                Response.StatusCode = (int)HttpStatusCode.OK;
                resu = JsonConvert.SerializeObject(Mapper.Map<TurnoModel>(turno));
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                resu = ex.Message;
            }
            return Json(resu, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPut]
        [Route("Sesion/Cancelar")]
        [CreateUpdateActionFilter("admin")]
        public JsonResult CancelarSesiones(ICollection<SesionModel> model)
        {
            string resu;
            try
            {
                //var turno = this.AgendaService.CancelarSesionesPendientes(id, User.Identity.Name);
                Response.StatusCode = (int)HttpStatusCode.OK;
                var sesiones = Mapper.Map<ICollection<Sesion>>(model);
                sesiones = this.AgendaService.CancelarSesiones(sesiones);
                resu = JsonConvert.SerializeObject(Mapper.Map<ICollection<SesionModel>>(sesiones));
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                resu = ex.Message;
            }
            return Json(resu, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        //[Route("Turno/Facturacion")]
        public JsonResult TurnoSetDatosFacturacion(TurnoFacturacionModel model)
        {
            string resu;
            try
            {
                this.AgendaService.SetDatosTurnoFacturacion(model.ID, model.FechaFactura, model.Factura, model.Importe);
                Response.StatusCode = (int)HttpStatusCode.OK;
                resu = "";
            }
            catch(Exception ex)
            {
                resu = ex.Message;
            }
            
            return Json(resu, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [OutputCache(NoStore = true, Duration = 0)]
        [Route("Turno/{ID}/Facturacion")]
        public ActionResult TurnoDatosFacturacion(int ID)
        {            
            var model = Mapper.Map<TurnoFacturacionModel>(this.AgendaService.GetTurno(ID));
            model.Sesions = model.Sesions.Where(x => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado)
             || (EstadoSesion)x.Estado == EstadoSesion.Cancelado
            )
            .OrderBy(x=>x.Numero)
            .ThenBy(x=>x.FechaHora)
            .ToList();

            List<SesionModel> sesiones = new List<SesionModel>();
            int sesion = 0;            
            model.Sesions.ToList().ForEach(s =>
            {
                if(s.Numero > sesion)
                {
                    sesiones.Add(s);
                    sesion = s.Numero;
                }
            });
            model.Sesions = sesiones;
            ViewBag.nroSesiones = sesion;            

            return PartialView(model);
        }

        [HttpPut]
        [CreateUpdateActionFilter("admin")]
        [Route("Turno/Cancelar")]
        public JsonResult CancelarTurno(Turno model)
        {
            string resu;
            try
            {
                var turno = this.AgendaService.CancelarTurno(Mapper.Map<Turno>(model));                
                Response.StatusCode = (int)HttpStatusCode.OK;
                resu = JsonConvert.SerializeObject(Mapper.Map<TurnoModel>(turno));
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                resu = ex.Message;
            }
            return Json(resu, JsonRequestBehavior.AllowGet);
        }

        [HttpPut]
        [Route("Sesion/Estado/Cancelar")]
        public JsonResult setSesionCancelada(int id)
        {
            SesionGrillaModel resu;
            try
            {
                resu = Mapper.Map<SesionGrillaModel>(this.AgendaService.SetSesionCancelada(id, User.Identity.Name ?? "admin"));
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                resu = new SesionGrillaModel();
            }
            return Json(JsonConvert.SerializeObject(resu), JsonRequestBehavior.AllowGet);
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
        public JsonResult ReservarSesion(TurnoModel model, List<int> sobreturnos)
        {
            try
            {
                var turno = Mapper.Map<Turno>(model);
                var sesiones = this.AgendaService.ReservarSesiones(turno, sobreturnos);
                var sesionesModel = Mapper.Map<TurnoModel>(sesiones);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(sesionesModel);
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
        [Route("Sesion/CodigoTransaccion")]
        public JsonResult ModificarSesionCodigoTransaccion(int id, string codigo)
        {                        
            if (this.AgendaService.ChangeCodigoTransaccionSesion(id, codigo, User.Identity.Name)) {
                return Json(codigo);
            }
            else
            {
                return Json("");
            }
            
        }

        [HttpPut]
        [CreateUpdateActionFilter("admin")]
        [Route("Sesion/Posponer")]
        public JsonResult PosponerSesion(List<SesionModel> model, DateTime? fecha)
        {
            try
            {
                var sesiones = Mapper.Map<ICollection<Sesion>>(model);
                if (fecha.HasValue)
                {
                    sesiones = this.AgendaService.PosponerSesion(sesiones,fecha.Value);
                }
                else
                {
                    sesiones = this.AgendaService.PosponerSesion(sesiones);
                }
                
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(JsonConvert.SerializeObject(sesiones),JsonRequestBehavior.AllowGet);
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
        [Route("Turno/{id}/NumeroAutorizacion")]
        public JsonResult ModificarTurnoNumeroAutorizacion(int id, string numero)
        {
            
            //try
            //{ChangeNumeroAutorizacionturno
            //    var sesiones = Mapper.Map<ICollection<Sesion>>(model);
            //    sesiones = this.AgendaService.CambiarFechaSesion(sesiones);
            //    Response.StatusCode = (int)HttpStatusCode.OK;
            //    return Json(sesiones);
            //}
            //catch (Exception ex)
            //{
            //    Response.StatusCode = (int)HttpStatusCode.Conflict;
            //    return Json(ex.Message);
            //}
            if (this.AgendaService.ChangeNumeroAutorizacionturno(id, numero, User.Identity.Name))
            {
                return Json(numero);
            }
            else
            {
                return Json("");
            }

        }

        [HttpPut]
        [CreateUpdateActionFilter("admin")]
        [Route("Turno/AgregarSesiones")]
        public JsonResult AgregarSesiones(Turno model, int sesiones, bool continuar)
        {
            try
            {                
                var turno = Mapper.Map<Turno>(model);
                this.AgendaService.AgregarSesiones(turno, sesiones, continuar);
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

        [HttpGet]
        [Route("Turno/SinFechaAsignada")]
        public ActionResult TurnoSinFechaAsignada()
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
        public JsonResult ConfirmarTurno(TurnoModel model, bool continuar, int? turnoID)
        {
            try
            {
                var turno = Mapper.Map<Turno>(model);
                turno = this.AgendaService.ConfirmarTurno(turno, continuar, turnoID);
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
            turno.Sesions = turno.Sesions.Where(s => s.Estado != 3).ToList();
            return Json(JsonConvert.SerializeObject(turno), JsonRequestBehavior.AllowGet);
            //return Json(turnos, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Agenda/JSON")]
        public JsonResult GetAgenda()
        {            
            var agenda = Mapper.Map<AgendaModel>(this.AgendaService.GetAgenda());
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(JsonConvert.SerializeObject(agenda), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Agenda/Dias")]
        public JsonResult GetDiasAgenda()
        {
            var agenda = Mapper.Map<AgendaModel>(this.AgendaService.GetAgenda());
            var dias = new List<ComboDTO>();
            if (agenda.AtiendeDomingo)
            {
                dias.Add(new ComboDTO { Text = "Domingo", Value = 0 });
            }
            if (agenda.AtiendeLunes)
            {
                dias.Add(new ComboDTO { Text = "Lunes", Value = 1 });
            }
            if (agenda.AtiendeMartes)
            {
                dias.Add(new ComboDTO { Text = "Martes", Value = 2 });
            }
            if (agenda.AtiendeMiercoles)
            {
                dias.Add(new ComboDTO { Text = "Miercoles", Value = 3 });
            }
            if (agenda.AtiendeJueves)
            {
                dias.Add(new ComboDTO { Text = "Jueves", Value = 4 });
            }
            if (agenda.AtiendeViernes)
            {
                dias.Add(new ComboDTO { Text = "Viernes", Value = 5 });
            }
            if (agenda.AtiendeSabado)
            {
                dias.Add(new ComboDTO { Text = "Sabado", Value = 6 });
            }

            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(dias, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Agenda/Receso")]
        public JsonResult GetRecesos()
        {
            var recesos = Mapper.Map<List<AgendaRecesoModel>>(this.AgendaService.SearchRecesos(DateTime.Now.AddYears(-10), DateTime.Now.AddYears(5)));
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(JsonConvert.SerializeObject(recesos), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Agenda/CreateOrEditReceso")]
        public ActionResult CreateOrEditReceso(int? id)
        {

            var receso = id.HasValue? Mapper.Map<AgendaRecesoModel>(this.AgendaService.GetReceso(id.Value)) : 
                new AgendaRecesoModel {AgendaId=1,
                    Habilitado =true,
                    RecesoTipoId =1 };
            Response.StatusCode = (int)HttpStatusCode.OK;
            return PartialView(receso);
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        [Route("Agenda/CreateOrEditReceso")]
        public JsonResult CreateOrEditReceso(AgendaRecesoModel model)
        {
            if (model.ID > 0)
            {
                AgendaService.EditReceso(Mapper.Map<Agenda_Receso>(model));
            }
            else
            {
                model.Habilitado = true;
                AgendaService.AddReceso(Mapper.Map<Agenda_Receso>(model));
            }            
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Agenda/Bloqueos")]
        public JsonResult GetBloqueos()
        {
            var bloqueos = Mapper.Map<List<AgendaBloqueosModel>>(this.AgendaService.GetAgenda().Agenda_Bloqueos.Where(x=>x.Habilitado));
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(JsonConvert.SerializeObject(bloqueos), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Agenda/CreateOrEditBloqueo")]
        public ActionResult CreateOrEditBloqueo(int? id)
        {
          
            Response.StatusCode = (int)HttpStatusCode.OK;
            return PartialView();
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        [Route("Agenda/CreateOrEditBloqueo")]
        public JsonResult CreateOrEditBloqueo(AgendaBloqueosModel model)
        {
            if (model.ID > 0)
            {
                AgendaService.EditBloqueoAgenda(Mapper.Map<Agenda_Bloqueos>(model));
            }
            else
            {
                model.Habilitado = true;
                AgendaService.AddBloqueoAgenda(Mapper.Map<Agenda_Bloqueos>(model));
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Agenda/Edit")]
        public ActionResult Edit()
        {
            return PartialView();
        }

        [HttpPut]
        [Route("Agenda/Edit")]
        public JsonResult Edit(AgendaModel model)
        {
            AgendaService.EditAgenda(Mapper.Map<Agendum>(model));
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Sesion/Posponer")]
        public ActionResult PosponerSesion()
        {
            return PartialView();
        }

        [HttpPost]
        [Route("Turno/Enviar")]
        public JsonResult SendMailTurnoP(int turnoId)
        {
            try
            {                
                Response.StatusCode = AgendaService.TurnoSendMail(turnoId) == true ? (int)HttpStatusCode.OK : (int)HttpStatusCode.BadRequest;
                return Json("", JsonRequestBehavior.AllowGet) ;
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(ex.ToString(), JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        [Route("Turno/DobleOrden")]
        public ActionResult DobleOrdenModal()
        {
            return PartialView();
        }

        [HttpPut]
        [Route ("Turno/SetDobleOrden")]
        [CreateUpdateActionFilter("admin")]
        public JsonResult SetDobleOrden(TurnoModel model, int? turnoID)
        {
            try
            {
                Response.StatusCode = (int)HttpStatusCode.OK;
                var turno = Mapper.Map<Turno>(model);
                AgendaService.SetTurnoDobleOrden(turno, turnoID);
                return Json(JsonConvert.SerializeObject(Mapper.Map<TurnoModel>(turno)), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.ToString(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        [Route("Turno/DobleOrden/{pacienteID}")]
        public JsonResult TunosSinDobleOrden(int pacienteID)
        {
            Response.StatusCode = (int)HttpStatusCode.OK;              
            return Json(AgendaService.GetNrosTurnosSinDobleOrden(pacienteID), JsonRequestBehavior.AllowGet);
        }

        
    }
}