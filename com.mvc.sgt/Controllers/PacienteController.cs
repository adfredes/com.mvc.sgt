using AutoMapper;
using com.mvc.sgt.Models;
using com.sgt.DataAccess;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.mvc.sgt.Controllers
{
    public class PacienteController : Controller
    {

        private readonly IPacienteService pacienteService;
        
        public PacienteController(IPacienteService pacienteService)
        {
            this.pacienteService = pacienteService;
        }
            
        // GET: Paciente
        public ActionResult Index()
        {
            return View();
        }

        //GET
        [HttpGet]
        public ActionResult CreateOrEdit(int? id)
        {
            return PartialView();
        }

        [HttpPost]
        public JsonResult CreateOrEdit(PacienteModel model)
        {
            if (model.ID.HasValue)
            {
                pacienteService.Edit(Mapper.Map<Paciente>(model));
            }

            return Json(model);
        }
    }
}