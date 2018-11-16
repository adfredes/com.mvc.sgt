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
        public ActionResult CreateOrEditFeriado (int? id)
        {
            return PartialView();
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        public JsonResult CreateOrEditFeriado (FeriadoModel model)
        {
            string resu;
            try
            {
                if (model.ID.HasValue)
                {
                    this.AgendaService.EditFeriado(Mapper.Map<Feriado>(model));
                }
                else
                {
                    this.AgendaService.AddFeriado(Mapper.Map<Feriado>(model));
                }
                resu = "";
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                resu = ex.Message;
            }
            
            return  Json(resu);
        }
    }
}