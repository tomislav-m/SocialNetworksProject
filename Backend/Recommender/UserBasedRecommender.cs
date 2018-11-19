using System;
using System.Collections.Generic;
using System.Linq;

namespace Recommender
{
    public class UserBasedRecommender
    {
        public Dictionary<string, Dictionary<string,int>> Model { get; set; }
        public string UserId { get; set; }
        public double SimilarityThreshold { get; set; }

        public UserBasedRecommender(Dictionary<string, Dictionary<string, int>> model, string userId, double similarityThreshold)
        {
            Model = model;
            UserId = userId;
            SimilarityThreshold = similarityThreshold;
        }

        public Dictionary<string, double> Recommend()
        {
            var userRatings = Model[UserId];
            var sim = new Dictionary<string, double>();
            var byItemModel = new Dictionary<string, Dictionary<string, int>>();
            foreach (var user in Model)
            {
                var similarity = CalculateSimilarity(user, userRatings, byItemModel);
                sim.Add(user.Key, similarity);
            }
            var predictedRatings = new Dictionary<string, double>();
            foreach(var item in byItemModel)
            {
                if (userRatings.ContainsKey(item.Key))
                {
                    continue;
                }
                var rating = PredictRating(item, sim);
                if (!double.IsNaN(rating))
                {
                    predictedRatings.Add(item.Key, rating);
                }
            }
            return predictedRatings.OrderByDescending(x => x.Value).ToDictionary(x => x.Key, x => x.Value);
        }

        private double CalculateSimilarity(KeyValuePair<string, Dictionary<string, int>> user, Dictionary<string, int> userRatings, Dictionary<string, Dictionary<string, int>> byItemModel)
        {
            double similarity = 0;
            var list = new List<double>();
            var list2 = new List<double>();
            double userMeanRating1 = user.Value.Sum(x => x.Value) / (double)user.Value.Count;
            double userMeanRating2 = userRatings.Sum(x => x.Value) / (double)userRatings.Count;
            foreach (var item in user.Value)
            {
                GroupByItem(byItemModel, user.Key, item);
                if (!userRatings.ContainsKey(item.Key))
                {
                    continue;
                }
                list.Add(userRatings[item.Key] - userMeanRating2);
                list2.Add(item.Value - userMeanRating1);
                similarity += (userRatings[item.Key] - userMeanRating2) * (item.Value - userMeanRating1);
            }
            similarity /= (CalcultateNorm(list2) * CalcultateNorm(list));

            return similarity;
        }

        private double CalcultateNorm(IEnumerable<double> ratings)
        {
            double norm = 0;
            foreach(var rating in ratings)
            {
                norm += Math.Pow(rating, 2);
            }
            return Math.Sqrt(norm);
        }

        private double PredictRating(KeyValuePair<string, Dictionary<string, int>> item, Dictionary<string, double> sim)
        {
            var predictedRating = 0d;
            var count = 0;
            foreach (var user in item.Value)
            {
                if (user.Key == UserId)
                {
                    continue;
                }
                var userSim = sim[user.Key];
                if (userSim < SimilarityThreshold)
                {
                    continue;
                }
                predictedRating += userSim * user.Value;
                count += 1;
            }
            predictedRating /= count;
            return predictedRating;
        }

        private void GroupByItem(Dictionary<string, Dictionary<string, int>> byItemModel, string userId, KeyValuePair<string, int> item)
        {
            if (byItemModel.ContainsKey(item.Key))
            {
                byItemModel[item.Key].Add(userId, item.Value);
            }
            else
            {
                var dict = new Dictionary<string, int>
                {
                    { userId, item.Value }
                };
                byItemModel.Add(item.Key, dict);
            }
        }
    }
}
