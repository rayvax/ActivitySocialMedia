using System.Linq;
using Application.Activities;
using Application.Activities.DTOs;
using Application.Profiles;
using Domain;
using Profile = AutoMapper.Profile;

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
            
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(p => p.DisplayName, opt => opt.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(p => p.UserName, opt => opt.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(p => p.About, opt => opt.MapFrom(aa => aa.AppUser.About))
                .ForMember(p => p.Image, opt => opt.MapFrom(aa => aa.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(p => p.Image, opt => opt.MapFrom(u => u.Photos.FirstOrDefault(photo => photo.IsMain).Url));

            CreateMap<ProfileEditInfo, AppUser>();
        }
    }
}