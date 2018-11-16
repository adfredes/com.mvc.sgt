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

namespace com.mvc.sgt.Controllers
{
    public class ConsultorioController : Controller
    {
        private IConsultorioService consultorioService;

        public ConsultorioController(IConsultorioService consultorioService) =>
            this.consultorioService = consultorioService;

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
    }
}