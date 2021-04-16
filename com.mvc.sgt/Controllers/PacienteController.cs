using AutoMapper;
using com.mvc.sgt.Controllers.Filters;
using com.mvc.sgt.Models;
using com.sgt.DataAccess;
using com.sgt.DataAccess.Enums;
using com.sgt.services.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
                try
                {
                    model.Add(new DiagnosticoModel
                    {
                        Diagnostico = Server.HtmlDecode(paciente.PacienteDiagnostico.Diagnostico)
                    });
                }
                catch  { }

                paciente.Turnoes
                    .Where(t => t.Diagnostico != null && t.Diagnostico.Length > 0 && t.Estado<4 
                        && t.Sesions.Where(s => s.Estado == 1 || s.Estado == 2 || s.Estado == 4 || s.Estado == 5).Count() > 0
                    )
                    .ToList()
                    .ForEach(t => model.Add(new DiagnosticoModel
                    {
                        Fecha = t.Sesions.Where(s => s.Estado == 1 || s.Estado == 2 || s.Estado == 4 || s.Estado == 5)
                        .OrderBy(s => s.FechaHora).FirstOrDefault().FechaHora,
                        Diagnostico = t.Diagnostico,
                        CodigoPractica = t.CodigoPractica,
                        TurnoID = t.ID,
                        Tipo = t.TipoSesionID
                }));
            }
            return Json(JsonConvert.SerializeObject(model.OrderByDescending(x=>x.Fecha).ToList()), JsonRequestBehavior.AllowGet);
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

        [Route("Paciente/File/{id}")]        
        [HttpDelete]
        public JsonResult DeleteFile(int? id)
        {            
            if (id.HasValue && id.Value>0)
            {
                pacienteService.DeleteFile(id.Value,User.Identity.Name);
                Response.StatusCode = (int)HttpStatusCode.OK;
            }            
            else
            {                
                Response.StatusCode = (int)HttpStatusCode.NotFound;
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
            var pacientes = this.pacienteService.FindBy(x => x.Habilitado == true);
            if (int.TryParse(name.Replace(".",""),out int resu)){
                pacientes = pacientes.Where(x => (x.DocumentoNumero.Replace(".", "")).Contains(name.Replace(".", "")));
            }
            else
            {
                name = name.ToLower();
                var filtros = name.Split(' ');
                filtros.ToList().ForEach(f =>
                {
                    pacientes = pacientes.Where(x => (x.Apellido + x.Nombre).Contains(f));
                });
            }
            
            
            
            
            
            var listModel = Mapper.Map<List<PacienteDto>>(pacientes.OrderBy(x => x.Apellido).ThenBy(x => x.Nombre));
            
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

        [HttpGet]
        public JsonResult ListarTurnosContinuar(int? id)
        {
            List<TurnoListModel> turnos = null;
            if (id.HasValue)
            {
                turnos = Mapper.Map<List<TurnoListModel>>(pacienteService.ListarTurnos(id.Value).Where(t => t.Estado == (short)EstadoTurno.Confirmado))
                    .OrderByDescending(t => t.ID).ToList();                    
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
            if (model.FechaNacimiento.Year < 1901) 
            {
                model.FechaNacimiento = DateTime.Now;
            }
            var resu = "";
            try
            {
                if (model.ID.HasValue && model.ID.Value > 0)
                {
                    pacienteService.Edit(Mapper.Map<Paciente>(model));
                    Response.StatusCode = (int)HttpStatusCode.OK;
                }
                else
                {
                    pacienteService.Add(Mapper.Map<Paciente>(model));
                    Response.StatusCode = (int)HttpStatusCode.Created;
                    model = Mapper.Map<PacienteDto>(pacienteService.GetPacienteByDocumento(model.DocumentoNumero));
                }
                return Json(model);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.Conflict;
                resu = ex.Message;
                return Json(resu);
            }

            
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

        [HttpGet]
        [Route("Paciente/{ID}/Tipo/{TipoID}/TurnosAnteriores")]
        public JsonResult ExistTurnosAnteriores(int ID, int TipoID)
        {
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(pacienteService.TurnosAnteriores(ID, TipoID), JsonRequestBehavior.AllowGet);
 
        }

        [HttpGet]
        [Route("Paciente/Turno/{ID}/IsSuperpuesto")]
        public JsonResult EsTurnoSuperpuesto(int ID)
        {
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(pacienteService.IsSesionesSuperpuestas(ID), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Route("Paciente/Sesion/IsSuperpuesto")]
        public JsonResult EsSesionSuperpuesta(int ID, DateTime fechaHoraSesion, int? PacienteId )
        {
            Response.StatusCode = (int)HttpStatusCode.OK;
            var resu = pacienteService.IsSesionSuperpuesta(ID, fechaHoraSesion);
            return Json(resu, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Route("Paciente/Turno/IsSuperpuesto")]
        public JsonResult EsTurnoSuperpuesta(TurnoModel turno)
        {
            // TODO: Hacer luego la logica
            Response.StatusCode = (int)HttpStatusCode.OK;
            
            var resu = pacienteService.IsSesionesSuperpuestas(Mapper.Map<Turno>(turno));
            return Json(resu, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Route("Paciente/DatosSesiones")]
        public ActionResult DatosSesiones()
        {
            return PartialView();
        }
        //[HttpGet]
        //[Route("Paciente/DNI/{documento}")]
        //public JsonResult GetPacienteDNI(string documento)
        //{

        //}
    }
}