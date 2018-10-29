using System;

namespace Utilities
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                Console.WriteLine("1. Get");
                Console.WriteLine("2. Exit");

                var key = Console.ReadLine();
                if(key == "1")
                {
                    Console.WriteLine("Enter URL:");
                    key = Console.ReadLine();
                    Utilities.Get(key).Wait();
                }
                else if(key == "2" || key.ToLower() == "exit")
                {
                    break;
                }
            }
        }
    }
}
