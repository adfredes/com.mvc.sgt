using com.mvc.sgt.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using com.sgt.DataAccess;
using AutoMapper;
using com.sgt.services.Interfaces;

namespace com.mvc.sgt.Controllers
{
    public class AseguradoraController : Controller
    {

        private readonly ICrudService CrudService;

        public AseguradoraController(ICrudService CrudService)
        {
            this.CrudService = CrudService;
        }
        // GET: Aseguradora
        public ActionResult Index()
        {            
            return View();
        }

        public ActionResult CreateOrEdit(int? id = null)
        {            
            return PartialView();
        }

        [HttpPost]
        public JsonResult CreateOrEdit(AseguradoraModel model)
        {
            //model.FechaModificacion = DateTime.Now;
            model.UsuarioModificacion = User.Identity.Name;
            if (model.ID.HasValue)
            {
                CrudService.Edit(Mapper.Map<Aseguradora>(model));
            }
            else
            {
                model.Habilitado = true;
                CrudService.Add(Mapper.Map<Aseguradora>(model));
            }
            return Json(model);
        }

        [HttpGet]
        public JsonResult GetAll()
        {
            List<AseguradoraModel> model;
            model = Mapper.Map<List<AseguradoraModel>>(CrudService.GetAll());                                 
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Get(int id)
        {
            AseguradoraModel model = Mapper.Map<AseguradoraModel>(CrudService.Find(id));            
            return Json(model, JsonRequestBehavior.AllowGet);
        }


    }
}