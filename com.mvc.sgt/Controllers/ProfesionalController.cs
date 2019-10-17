using AutoMapper;
using com.mvc.sgt.Controllers.Filters;
using com.mvc.sgt.Models;
using com.mvc.sgt.Models.DTO;
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
    public class ProfesionalController : Controller
    {
        private readonly IProfesionalService profesionalService;

        public ProfesionalController(IProfesionalService profesionalService) =>
            this.profesionalService = profesionalService;
        
        
        public ActionResult Index()
        {
            return PartialView();
        }

        [HttpGet]
        public ActionResult CreateOrEdit()
        {
            return PartialView();
        }

        [CreateUpdateActionFilter("admin")]
        [HttpPost]
        public JsonResult CreateOrEdit(ProfesionalModel model)
        {
            var resu = "";
            try
            {
                var entidad = Map(model);
                if (model.ID.HasValue)
                {
                    profesionalService.Edit(entidad);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                }
                else
                {
                    profesionalService.Add(entidad);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                }                
            }
            catch(Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                resu = ex.Message;
            }            
            return Json(resu);
        }

        [Route("Profesional/Listar/Combo")]
        [HttpGet]
        public JsonResult GetAllCombo()
        {
            var model = Mapper.Map<List<ComboDTO>>(profesionalService.GetAll());
            return Json(model.OrderBy(s => s.Text).ToList(), JsonRequestBehavior.AllowGet);

        }

        [Route("Profesional/Listar/{page}/{count}")]
        [HttpGet]
        public JsonResult GetAll(int page, int count)
        {
            //var model = Mapper.Map<List<PacienteModel>>(this.pacienteService.GetAll().OrderBy(x => x.Apellido));            
            var model = Map(profesionalService.GetAll(page,count));
            return Json(new { list = model, count = this.profesionalService.GetAll().Count }, JsonRequestBehavior.AllowGet);
        }

        [Route("Profesional/Listar/{letter}/{page}/{count}")]
        [HttpGet]
        public JsonResult GetAllByLetter(string letter, int page, int count)
        {            
            var model = Map(profesionalService.FindByLetter(letter,page,count));
            var regisCount = this.profesionalService.FindBy(x => x.Apellido.Substring(0, 1).ToUpper() == letter)                                
                                .Count();
            return Json(new { list = model, count = regisCount }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Get (int id)
        {
            var model = Map(profesionalService.Find(id));
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [Route("Profesional/Ausencias")]
        [HttpGet]
        public JsonResult GetProfesionalAusencias()
        {
            var model = Mapper.Map<List<ProfesionalAusenciaModel>>(this.profesionalService.GetAllAusencias());
            return Json(JsonConvert.SerializeObject(model), JsonRequestBehavior.AllowGet);
        }

        [Route("Profesional/Ausencias/CreateOrEdit")]
        [HttpPost]
        public JsonResult CreateOrEditProfesionalAusencias(ProfesionalAusenciaModel model)
        {
            var entity = Mapper.Map<Profesional_Ausencias>(model);
            this.profesionalService.SaveAusencia(entity);            
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        [Route("Profesional/Ausencias/CreateOrEdit")]
        [HttpGet]
        public ActionResult CreateOrEditProfesionalAusencias()
        {
            return PartialView();
        }
        

        private ProfesionalModel Map(Profesional entity) =>
            Mapper.Map<ProfesionalModel>(entity);
        

        private ICollection<ProfesionalModel> Map(ICollection<Profesional> entities) =>
            Mapper.Map<List<ProfesionalModel>>(entities);
        

        private Profesional Map(ProfesionalModel entity) =>
            Mapper.Map<Profesional>(entity);        
    }
}