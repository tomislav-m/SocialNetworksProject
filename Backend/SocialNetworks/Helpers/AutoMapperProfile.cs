using AutoMapper;
using SocialNetworks.Models;

namespace SocialNetworks.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<User, FacebookUserData>();
            CreateMap<FacebookUserData, User>();
        }
    }
}