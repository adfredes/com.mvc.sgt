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
                        "~/Scripts/jquery-{version}.min.js",
                        "~/Scripts/jquery.contextMenu.min.js",
                        "~/Scripts/pdfmake/pdfmake.min.js",
                        "~/Scripts/pdfmake/vfs_fonts.js",
                        "~/Scripts/jquery-ui-1.12.1.min.js"
                        //"~/Scripts/jquery-ui-1.10.0.min.js"
                        //"~/Scripts/jquery-ui-touch-punch.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                            "~/Scripts/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información sobre los formularios. De este modo, estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.min.js",
                      "~/Scripts/respond.min.js",
                      "~/Scripts/moment.min.js",                      
                      "~/Scripts/bootstrap-datepicker.min.js",                      
                      "~/Scripts/locales/bootstrap-datepicker.es.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/angular-material.css",
                      "~/Content/site.css",
                      "~/Content/fontello.css",
                      "~/Content/animation.css",
                      "~/Content/Styles.css",
                      "~/Content/ui-bootstrap-csp.css",
                      "~/Content/jquery.contextMenu.min.css",
                      "~/Content/bootstrap-datepicker.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular-core").Include(
                    "~/Scripts/angular.js",
                    "~/Scripts/angular-locale_es-ar.js",
                    "~/Scripts/angular-animate.min.js",
                    "~/Scripts/angular-messages.min.js",
                    "~/Scripts/angular-route.min.js",
                    "~/Scripts/angular-sanitize.min.js",                    
                    "~/Scripts/angular-aria.min.js",                    
                    "~/Scripts/angular-material.min.js"                    
                ));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(                    
                    "~/Scripts/es5/Angular/Module/*.js",
                    "~/Scripts/es5/Angular/Services/*.js",
                    "~/Scripts/es5/Angular/Controllers/*.js",
                    "~/Scripts/es5/Angular/Directives/*.js",
                    "~/Scripts/es5/Angular/Components/*.js"
                ));
   
            bundles.Add(new ScriptBundle("~/bundles/grilla").Include(
                "~/Scripts/es5/Grilla/grilla.js"
                ));



            BundleTable.EnableOptimizations = true;
        }
    }
}