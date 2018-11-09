using Newtonsoft.Json;

namespace SocialNetworks.Models
{
    public class GoogleUserData
    {
        public string Email { get; set; }
        public string AccessToken { get; set; }
        [JsonProperty("given_name")]
        public string FirstName { get; set; }
        [JsonProperty("family_name")]
        public string LastName { get; set; }

    }
}