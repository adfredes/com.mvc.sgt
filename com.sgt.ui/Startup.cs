using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(com.sgt.ui.Startup))]
namespace com.sgt.ui
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
