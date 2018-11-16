using AutoMapper;
using com.mvc.sgt.Models;
using com.mvc.sgt.Models.DTO;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace com.mvc.sgt.Controllers
{
    public class ApiDefaultController : ApiController
    {
        private IProvinciaService provinciaService;
        private ILocalidadService localidadService;
        private IAseguradoraService aseguradoraService;
        private IConsultorioService consultorioService;
        

        public ApiDefaultController(IProvinciaService provinciaService, ILocalidadService localidadService, 
            IAseguradoraService aseguradoraService, IConsultorioService consultorioService)
        {
            this.provinciaService = provinciaService;
            this.localidadService = localidadService;
            this.aseguradoraService = aseguradoraService;
            this.consultorioService = consultorioService;
        }

        [Route("api/provincia/all/cmb")]
        public IHttpActionResult GetProvincias()
        {
            return Ok(Mapper.Map<List<ComboDTO>>(this.provinciaService.GetAll()));
        }

        [Route("api/provincia/{idProvincia}/localidad/all/cmb")]
        public IHttpActionResult GetLocalidadByIdProvincia(int idProvincia)
        {
            return Ok(Mapper.Map<List<ComboDTO>>(this.localidadService.getByProvincia(idProvincia)));
        }

        [Route("api/aseguradora/all/cmb")]
        public IHttpActionResult GetAseguradoras()
        {
            return Ok(Mapper.Map<List<ComboDTO>>(this.aseguradoraService.GetAll()));
        }

        [Route("api/aseguradora/{idPlan}/plan/all/cmb")]
        public IHttpActionResult GetPlanes(int idPlan)
        {
            return Ok(Mapper.Map<List<ComboDTO>>(this.aseguradoraService.Find(idPlan).Aseguradora_Plan));
        }

        [Route("api/tiposesion/all/cmb")]
        public IHttpActionResult GetTipoSesion()
        {            
            return Ok(Mapper.Map<List<ComboDTO>>(this.consultorioService.GetAllTipoSesion()));
        }


    }
}
