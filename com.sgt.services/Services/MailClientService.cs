using com.sgt.DataAccess;
using com.sgt.DataAccess.Interfaces;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Services
{
    public class MailClientService : IMailClientService
    {

        private IUnitOfWork unitOfWork;

        public MailClientService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        private SmtpMail GetConfig() => unitOfWork.RepoSmtpMail.GetAll().FirstOrDefault();

        public bool SendMail(SmtpMail config, string to, string subject, string body)
        {
            config = config ?? GetConfig();
            if (config != null)
            {
                var senderEmail = new MailAddress(config.Mail, "Consultorio");
                var receiverEmail = new MailAddress(to);

                var smtp = new SmtpClient
                {
                    Host = config.Host,
                    Port = config.Port,
                    EnableSsl = config.Ssl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(config.User, config.Pass)
                };

                using (var message = new MailMessage(senderEmail, receiverEmail)
                {
                    Subject = subject,
                    Body = body
                })
                {
                    smtp.Send(message);
                }
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
