using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;


namespace com.mvc.sgt.Controllers.Filters
{
    public class CreateUpdateActionFilter  : FilterAttribute, IActionFilter
    {
        private readonly string _usuario;

        public CreateUpdateActionFilter(string usuario)
        {
            _usuario = usuario;
        }

        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
           

        }

        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var model = filterContext.ActionParameters["model"];
            if (model == null)
            {
                // The action didn't have an argument called "model" or this argument
                // wasn't of the expected type => no need to continue any further
                return;
            }
            PropertyInfo prop1 = model.GetType().GetProperty("FechaModificacion", BindingFlags.Public | BindingFlags.Instance);
            if (null != prop1 && prop1.CanWrite)
            {                
                prop1.SetValue(model, DateTime.Now);
            }

            PropertyInfo prop2 = model.GetType().GetProperty("UsuarioModificacion", BindingFlags.Public | BindingFlags.Instance);
            if (null != prop2 && prop1.CanWrite)
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    prop2.SetValue(model, HttpContext.Current.User.Identity.Name.Trim());
                }
                else
                {
                    prop2.SetValue(model, _usuario);
                }
                
            }

        }
    }
}