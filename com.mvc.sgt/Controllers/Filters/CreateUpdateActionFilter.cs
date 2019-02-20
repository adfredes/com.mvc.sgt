using System;
using System.Collections;
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
                return;
            }

            if ((model is IList || model is ICollection) && model.GetType().IsGenericType)
            {
                foreach(var m in (IList)model)
                {
                    var p = m;
                        SetObjectUserDate(ref p);                   
                }
            }
            else
            {
                SetObjectUserDate(ref model);              
            }            
        }

        private void SetObjectUserDate(ref object m)
        {
            PropertyInfo prop1 = m.GetType().GetProperty("FechaModificacion", BindingFlags.Public | BindingFlags.Instance);
            if (null != prop1 && prop1.CanWrite)
            {
                prop1.SetValue(m, DateTime.Now);
            }

            PropertyInfo prop2 = m.GetType().GetProperty("UsuarioModificacion", BindingFlags.Public | BindingFlags.Instance);
            if (null != prop2 && prop2.CanWrite)
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    prop2.SetValue(m, HttpContext.Current.User.Identity.Name.Trim());
                }
                else
                {
                    prop2.SetValue(m, _usuario);
                }

            }            
        }
       
    }
}