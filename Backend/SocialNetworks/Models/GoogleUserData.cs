using Newtonsoft.Json;

namespace SocialNetworks.Models
{
    public class GoogleUserData
    {
        public string Email { get; set; }
        public string AccessToken { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
    }
}