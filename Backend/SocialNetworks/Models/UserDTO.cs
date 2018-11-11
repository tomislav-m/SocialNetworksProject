using System.Collections.Generic;

namespace SocialNetworks.Models
{
    public class UserDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Dictionary<string, int> MovieRatings { get; set; }
    }
}