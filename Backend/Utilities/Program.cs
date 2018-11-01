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
                Console.WriteLine("2. Get and save cast");
                Console.WriteLine("3. Get and save genres");
                Console.WriteLine("4. Exit");

                var key = Console.ReadLine();
                if(key == "1")
                {
                    Console.WriteLine("Enter URL:");
                    key = Console.ReadLine();
                    Utilities.GetMovies(key).Wait();
                }
                else if(key == "2")
                {
                    Utilities.GetAndSaveCast().Wait();
                }
                else if(key == "3")
                {
                    Utilities.GetAndSaveGenres().Wait();
                }
                else if(key == "4" || key.ToLower() == "exit")
                {
                    break;
                }
            }
        }
    }
}
