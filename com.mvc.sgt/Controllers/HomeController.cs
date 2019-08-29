using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.mvc.sgt.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            //return RedirectToAction("Login", "Account",);            
            return View();
        }

        public ActionResult FormElementError()
        {
            return PartialView();
        }
    }
}
