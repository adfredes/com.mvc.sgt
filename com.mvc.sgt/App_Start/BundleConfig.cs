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
                        "~/Scripts/jquery.contextMenu.min.js",
                        "~/Scripts/pdfmake/pdfmake.min.js",
                        "~/Scripts/pdfmake/vfs_fonts.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                            "~/Scripts/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información sobre los formularios. De este modo, estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/moment.js",
                      "~/Scripts/bootstrap-datepicker.min.js",
                      "~/Scripts/locales/bootstrap-datepicker.es.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/angular-material.css",
                      "~/Content/site.css",
                      "~/Content/fontello.css",
                      "~/Content/animation.css",
                      "~/Content/Styles.css",
                      "~/Content/jquery.contextMenu.min.css",
                      "~/Content/bootstrap-datepicker.min.css"));
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                    "~/Scripts/angular.js",
                    "~/Scripts/angular-locale_es-ar.js",
                    "~/Scripts/angular-animate.min.js",
                    "~/Scripts/angular-messages.js",
                    "~/Scripts/angular-route.min.js",
                    "~/Scripts/angular-aria.js",
                    "~/Scripts/angular-material.js",
                    "~/Scripts/Angular/Module/*.js",
                    "~/Scripts/Angular/Services/*.js",
                    "~/Scripts/Angular/Controllers/*.js",
                    "~/Scripts/Angular/Directives/*.js",
                    "~/Scripts/Angular/Components/*.js"
                ));


            BundleTable.EnableOptimizations = true;
        }
    }
}