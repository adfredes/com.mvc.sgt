using System.Web;
using System.Web.Optimization;

namespace com.mvc.sgt
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery.contextMenu.min.js"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información sobre los formularios. De este modo, estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/moment.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(                    
                      "~/Content/bootstrap.css",
                      "~/Content/angular-material.css",
                      "~/Content/site.css",
                      "~/Content/fontello.css",                      
                      "~/Content/animation.css",
                      "~/Content/Styles.css",
                      "~/Content/jquery.contextMenu.min.css"));

            //bundles.Add(new ScriptBundle("~/bundles/angularAseguradora").Include(
            //      "~/Scripts/angular.js",
            //      "~/Scripts/angular-animate.min.js",
            //      "~/Scripts/angular-messages.js",
            //      "~/Scripts/angular-aria.js",
            //      "~/Scripts/angular-material.js",
            //      "~/Scripts/Angular/Module/SgtModule.js",
            //      "~/Scripts/Angular/Services/CrudService.js"
            //  "~/Scripts/Angular/Controllers/AseguradoraController.js",
            //  "~/Scripts/Angular/Directives/AseguradoraDirectives.js"
            //  ));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                    "~/Scripts/angular.js",
                    "~/Scripts/angular-animate.min.js",
                    "~/Scripts/angular-messages.js",
                    "~/Scripts/angular-route.min.js",
                    "~/Scripts/angular-aria.js",
                    "~/Scripts/angular-material.js",
                    "~/Scripts/Angular/Module/SgtModule.js",
                    "~/Scripts/Angular/Services/CrudService.js",
                    "~/Scripts/Angular/Controllers/NavBarController.js",
                    "~/Scripts/Angular/Controllers/AseguradoraController.js",
                    "~/Scripts/Angular/Directives/AseguradoraDirectives.js",
                    "~/Scripts/Angular/Controllers/PacienteController.js",
                    "~/Scripts/Angular/Directives/PacienteDirectives.js",
                    "~/Scripts/Angular/Components/PacienteSearch.js",
                    "~/Scripts/Angular/Controllers/AgendaController.js",
                    "~/Scripts/Angular/Components/FeriadoComponent.js",
                    "~/Scripts/Angular/Controllers/ConsultorioController.js",
                    "~/Scripts/Angular/Components/ConsultorioComponent.js",
                    "~/Scripts/Angular/Controllers/ProfesionalController.js",
                    "~/Scripts/Angular/Components/ProfesionalComponent.js",
                    "~/Scripts/Angular/Components/CalendarPopUpComponet.js"
                ));

            //bundles.Add(new ScriptBundle("~/bundles/angularPaciente").Include(
            //        "~/Scripts/angular.js",
            //        "~/Scripts/angular-animate.min.js",
            //        "~/Scripts/angular-messages.js",
            //        "~/Scripts/angular-aria.js",
            //        "~/Scripts/angular-material.js",
            //        "~/Scripts/Angular/Module/SgtModule.js",
            //        "~/Scripts/Angular/Services/CrudService.js",
            //        "~/Scripts/Angular/Controllers/PacienteController.js",
            //        "~/Scripts/Angular/Directives/PacienteDirectives.js"
            //    ));

            BundleTable.EnableOptimizations = true;
        }
    }
}
