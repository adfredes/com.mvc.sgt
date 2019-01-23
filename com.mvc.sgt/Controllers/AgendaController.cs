using AutoMapper;
using com.mvc.sgt.Controllers.Filters;
using com.mvc.sgt.Models;
using com.sgt.DataAccess;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace com.mvc.sgt.Controllers
{
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
            return Json(resu);
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
            return Json(resu);
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
            return Json(resu);
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
            return Json(resu);
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        public JsonResult BloquearSesion(TurnoModel model)
        {
            try
            {
                var sesiones = Mapper.Map<List<SesionGrillaModel>>(this.AgendaService.BloquearSesion(Mapper.Map<Turno>(model)));
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(sesiones);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                return Json(ex.Message);
            }


        }


    }
}