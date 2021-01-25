using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.common.util
{
    public static class Fecha
    {
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int num = dt.DayOfWeek - startOfWeek;
            if (num < 0)
                num += 7;
            return dt.AddDays((double)(-1 * num)).Date;
        }

        public static DateTime EndOfWeek(this DateTime dt, DayOfWeek endOfWeek)
        {
            int num = endOfWeek - dt.DayOfWeek;
            if (num == 0)
                return dt;
            return dt.AddDays((double)num).Date;
        }

        public static DateTime NextDayOfWeek(this DateTime dt, DayOfWeek dayOfWeek)
        {
            if (dt.DayOfWeek == dayOfWeek)
                return dt.AddDays(7.0);
            DateTime dateTime = new DateTime(dt.Ticks);
            do
            {
                dateTime = dateTime.AddDays(1.0);
            }
            while (dateTime.DayOfWeek != dayOfWeek);
            return dateTime;
        }

        public static DateTime AddDays(this DateTime dt, double value, bool skipWeekend)
        {
            if (!skipWeekend)
                return dt.AddDays(value);
            return dt.AddDays(value + 2.0);
        }

        public static DateTime AddBusinessDays(this DateTime dt, double value)
        {
            if (value == 0.0)
                return dt;
            int num1 = value > 0.0 ? 1 : -1;
            int num2 = 1;
            while ((double)num2 < value)
            {
                dt = dt.AddDays((double)num1);
                if (dt.DayOfWeek != DayOfWeek.Saturday && dt.DayOfWeek != DayOfWeek.Sunday)
                    ++num2;
            }
            return dt;
        }

        public static List<DateTime> NextDays(this DateTime dt, int value, bool[] atiendeDia)
        {            
                List<DateTime> days = new List<DateTime>();                

                for (int c = 0; c < value; c++)
                {
                    DateTime day = dt.AddDays(c);
                if(atiendeDia[(int)day.DayOfWeek])
                {
                    days.Add(day);
                }
                    //if (!(day.DayOfWeek == DayOfWeek.Saturday || day.DayOfWeek == DayOfWeek.Sunday))
                    //{
                    //days.Add(day);
                    //}
                }
            return days;
        }
    }
}
