using com.sgt.DataAccess;
using com.sgt.DataAccess.Interfaces;
using com.sgt.DataAccess.Repositories;
using com.sgt.services.Interfaces;
using com.sgt.services.Services;
using IdentitySample.Controllers;
using IdentitySample.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using Unity;
using Unity.Injection;

namespace com.mvc.sgt
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public static class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container =
          new Lazy<IUnityContainer>(() =>
          {
              var container = new UnityContainer();
              RegisterTypes(container);
              return container;
          });

        /// <summary>
        /// Configured Unity Container.
        /// </summary>
        public static IUnityContainer Container => container.Value;
        #endregion

        /// <summary>
        /// Registers the type mappings with the Unity container.
        /// </summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>
        /// There is no need to register concrete types such as controllers or
        /// API controllers (unless you want to change the defaults), as Unity
        /// allows resolving a concrete type even if it was not previously
        /// registered.
        /// </remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below.
            // Make sure to add a Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            // TODO: Register your type's mappings here.
            // container.RegisterType<IProductRepository, ProductRepository>();
            container.RegisterType<IAseguradoraService, AseguradoraService >();
            container.RegisterType<IAseguradoraRepository, AseguradoraRepository>();

            container.RegisterType<IPacienteService, PacienteService>();
            container.RegisterType<IPacienteRepository, PacienteRepository>();

            container.RegisterType<IProvinciaService, ProvinciaService>();
            container.RegisterType<IProvinciaRepository, ProvinciaRepository>();

            container.RegisterType<ILocalidadService, LocalidadService>();
            container.RegisterType<ILocalidadRepository, LocalidadRepository>();

            container.RegisterType<IAgendaService, AgendaService>();
            container.RegisterType<IFeriadoRepository, FeriadoRepository>();

            container.RegisterType<IConsultorioService, ConsultorioService>();
            container.RegisterType<IConsultorioRepository, IConsultorioRepository>();

            container.RegisterType<IProfesionalService, ProfesionalService>();
            container.RegisterType<IProfesionalRepository, ProfesionalRepository>();

            container.RegisterType<System.Data.Entity.DbContext, TurnosDB>();
            container.RegisterType<IUnitOfWork, UnitOfWork>();

            container.RegisterType<IUserStore<ApplicationUser>, UserStore<ApplicationUser>>();
            container.RegisterType<UserManager<ApplicationUser>>();
            container.RegisterType<DbContext, ApplicationDbContext>();
            container.RegisterType<ApplicationUserManager>();
            container.RegisterType<AccountController>(new InjectionConstructor());


        }

        public static void RegisterComponents()
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            DependencyResolver.SetResolver(new Unity.AspNet.Mvc.UnityDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new Unity.AspNet.WebApi.UnityDependencyResolver(container);
        }
    }
}