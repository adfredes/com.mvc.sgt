﻿using AutoMapper;
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
            return PartialView();
        }

        [HttpGet]
        public JsonResult GetAll()
        {
            var model = Mapper.Map<List<PacienteModel>>(this.pacienteService.GetAll().Take(10));
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [Route("Paciente/{id}/Diagnostico")]
        [HttpGet]
        public JsonResult getDiagnostico(int id)
        {
            var model = new List<DiagnosticoModel>();
            var paciente = this.pacienteService.Find(id);
            Response.StatusCode = (int) HttpStatusCode.OK;
            if (paciente != null) { 
            paciente.Turnoes
                .Where(t => t.Diagnostico != null && t.Diagnostico.Length > 0)
                .OrderBy(p => p.Fecha).ToList()
                .ForEach(t => model.Add(new DiagnosticoModel
                {
                    Fecha = t.Fecha,
                    Diagnostico = t.Diagnostico
                }));
            }
            return Json(JsonConvert.SerializeObject(model), JsonRequestBehavior.AllowGet);
        }

        [Route("Paciente/Listar/{page}/{count}")]
        [HttpGet]
        public JsonResult GetAll(int page, int count)
        {
            //var model = Mapper.Map<List<PacienteModel>>(this.pacienteService.GetAll().OrderBy(x => x.Apellido));
            var model = Mapper.Map<List<PacienteModel>>(this.pacienteService.GetAll().OrderBy(x => x.Apellido).ThenBy(x=>x.Nombre).Skip((page - 1) * count).Take(count));
            return Json(JsonConvert.SerializeObject(new { list = model, count = this.pacienteService.GetAll().Count}), JsonRequestBehavior.AllowGet);
        }

        [Route("Paciente/Listar/{letter}/{page}/{count}")]
        [HttpGet]
        public JsonResult GetAllByLetter(string letter, int page, int count)
        {
            //var model = Mapper.Map<List<PacienteModel>>(this.pacienteService.GetAll().OrderBy(x => x.Apellido));
            var model = Mapper.Map<List<PacienteModel>>(this.pacienteService.GetAll()
                .Where(x=>x.Apellido.Substring(0,1).ToUpper() ==letter)
                .OrderBy(x => x.Apellido).ThenBy(x => x.Nombre).Skip((page - 1) * count).Take(count));
            var regisCount = this.pacienteService.GetAll()
                                .Where(x => x.Apellido.Substring(0, 1).ToUpper() == letter)
                                .Count();
            return Json(JsonConvert.SerializeObject(new { list = model, count = regisCount }), JsonRequestBehavior.AllowGet);
        }

        public ActionResult QuickSearch()
        {
            return PartialView();
        }

        [Route("Paciente/ViewFiles")]
        [HttpGet]
        public ActionResult ViewFiles()
        {
            return PartialView();
        }

        [Route("Paciente/File")]
        [CreateUpdateActionFilter("admin")]
        [HttpPost]
        public JsonResult AddFile(ImagenModel model)
        {           
            var imagen = Mapper.Map<Imagen>(model);
            if (imagen.ID > 0)
            {

            }
            else
            {                
                pacienteService.AddFile(imagen);
                Response.StatusCode = (int)HttpStatusCode.OK;
            }
            return Json("OK");
        }

        [Route("Paciente/{PacienteID}/File")]
        [HttpGet]
        public JsonResult GetFiles(int PacienteID)
        {
            var imagenes = Mapper.Map<List<ImagenDescriptionModel>>(pacienteService.GetFiles(PacienteID));
            return Json(JsonConvert.SerializeObject(imagenes), JsonRequestBehavior.AllowGet);
        }

        [Route("Paciente/File/{ID}")]
        [HttpGet]
        public JsonResult GetFile(int ID)
        {
            var imagen = Mapper.Map<ImagenModel>(pacienteService.GetFile(ID));
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(imagen, JsonRequestBehavior.AllowGet);
        }

        [Route("Paciente/Listar/Name/{name}")]
        [HttpGet]
        public JsonResult GetByNameOrLastName(string name)
        {
            name = name.ToLower();
            var listModel = Mapper.Map<List<PacienteDto>>(this.pacienteService.GetAll()
                .Where(x => x.Apellido.ToLower().StartsWith(name) || x.Nombre.ToLower().StartsWith(name)
                        || (x.Apellido.ToLower() + " " + x.Nombre.ToLower()).StartsWith(name))
                .OrderBy(x => x.Apellido).ThenBy(x => x.Nombre));
            return Json(JsonConvert.SerializeObject(listModel), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult ViewTurnos()
        {
            return PartialView();
        }

        [HttpGet]
        public ActionResult ViewSesiones()
        {
            return PartialView();
        }

        [HttpGet]
        public JsonResult ListTurnos(int? id)
        {
            List<TurnoModel> turnos = null;
            if (id.HasValue)
            {
                turnos = Mapper.Map<List<TurnoModel>>(pacienteService.ListarTurnos(id.Value));                
            }

            return Json(JsonConvert.SerializeObject(turnos), JsonRequestBehavior.AllowGet);
            //return Json(turnos, JsonRequestBehavior.AllowGet);
        }

        //GET
        [HttpGet]
        public ActionResult CreateOrEdit(int? id)
        {
            return PartialView();
        }

        [HttpGet]
        public ActionResult QuickCreate()
        {
            return PartialView();
        }

        [HttpGet]
        public ActionResult View(int? id)
        {
            return PartialView();
        }

        [HttpPost]
        [CreateUpdateActionFilter("admin")]
        public JsonResult CreateOrEdit(PacienteDto model)
        {
            var resu = "";
            try
            {
                if (model.ID.HasValue)
                {
                    pacienteService.Edit(Mapper.Map<Paciente>(model));
                    Response.StatusCode = (int)HttpStatusCode.OK;
                }
                else
                {
                    pacienteService.Add(Mapper.Map<Paciente>(model));
                    Response.StatusCode = (int)HttpStatusCode.Created;
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                resu = ex.Message;
            }

            return Json(resu);
        }

        [HttpGet]
        public JsonResult Get(int id)
        {
            PacienteDto model = Mapper.Map<PacienteDto>(pacienteService.Find(id));
            return Json(JsonConvert.SerializeObject(model), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult PacientesAnualesAviso()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("Paciente/Anual/Sesiones")]
        public JsonResult GetPacientesAnuales()
        {
            var pacientes = Mapper.Map<List<PacienteSearchDto>>(pacienteService.ListarPacientesAnualesCondicionSesiones());
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(pacientes, JsonRequestBehavior.AllowGet);
        }
    }
}