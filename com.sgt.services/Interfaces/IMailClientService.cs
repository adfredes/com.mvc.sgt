using com.sgt.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Interfaces
{
    public interface IMailClientService
    {
        bool SendMail(SmtpMail config, string to, string subject, string body);
    }
}
