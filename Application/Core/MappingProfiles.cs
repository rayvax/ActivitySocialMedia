using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName, opt => opt.MapFrom(activity => 
                    activity.Attendees.FirstOrDefault(u => u.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(p => p.DisplayName, opt => opt.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(p => p.UserName, opt => opt.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(p => p.About, opt => opt.MapFrom(aa => aa.AppUser.About));
        }
    }
}