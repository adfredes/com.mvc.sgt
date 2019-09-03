using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.ExtensionMethod
{
    public static class StringExtension
    {
        public static string toFirstName(this string item)
        {
            TextInfo myTI = new CultureInfo("es-AR", false).TextInfo;
            return myTI.ToTitleCase(item) ;

        }

        public static string toLastName(this string item)
        {
            TextInfo myTI = new CultureInfo("es-AR", false).TextInfo;
            return myTI.ToUpper(item);

        }

    }
}
