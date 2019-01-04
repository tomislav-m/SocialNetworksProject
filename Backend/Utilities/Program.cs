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
                Console.WriteLine("4. Get more movies");
                Console.WriteLine("5. Recommend");
                Console.WriteLine("6. CalculateAverageScore");
                Console.WriteLine("7. GetAndSaveSoundtrack");
                Console.WriteLine("8. CreateUsers");
                Console.WriteLine("9. AddRatings");
                Console.WriteLine("10. Update");
                Console.WriteLine("11. Exit");

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
                else if(key == "4")
                {
                    Utilities.GetMore().Wait();
                }
                else if (key == "5")
                {
                    Utilities.RecommenderTest().Wait();
                }
                else if(key == "6")
                {
                    Utilities.CalculateAverageScore().Wait();
                }
                else if(key == "7")
                {
                    Utilities.GetAndSaveSoundtrack().Wait();
                }
                else if(key == "8")
                {
                    Utilities.CreateUsers().Wait();
                }
                else if(key == "9")
                {
                    Utilities.AddRatings().Wait();
                }
                else if(key == "10")
                {
                    Utilities.Update().Wait();
                }
                else if(key == "11" || key.ToLower() == "exit")
                {
                    break;
                }
            }
        }
    }
}
