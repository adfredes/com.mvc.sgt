using com.mvc.sgt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using com.sgt.DataAccess;
using AutoMapper;
using com.sgt.services.Interfaces;
using com.mvc.sgt.Controllers.Filters;

namespace com.mvc.sgt.Controllers
{
    [Authorize]
    public class AseguradoraController : Controller
    {

        private readonly IAseguradoraService AseguradoraService;

        public AseguradoraController(IAseguradoraService AseguradoraService)
        {
            this.AseguradoraService = AseguradoraService;
        }
        // GET: Aseguradora
        public ActionResult Index()
        {
            return PartialView();
        }

        public ActionResult CreateOrEdit(int? id = null)
        {            
            return PartialView();
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        public JsonResult CreateOrEdit(AseguradoraModel model)
        {
            //model.FechaModificacion = DateTime.Now;            
            if (model.ID.HasValue)
            {
                AseguradoraService.Edit(Mapper.Map<Aseguradora>(model));
            }
            else
            {
                model.Habilitado = true;
                AseguradoraService.Add(Mapper.Map<Aseguradora>(model));
            }
            return Json(model);
        }

        [HttpGet]
        public JsonResult GetAll()
        {
            List<AseguradoraModel> model;
            model = Mapper.Map<List<AseguradoraModel>>(AseguradoraService.GetAll());                                 
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Get(int id)
        {
            AseguradoraModel model = Mapper.Map<AseguradoraModel>(AseguradoraService.Find(id));            
            return Json(model, JsonRequestBehavior.AllowGet);
        }


    }
}