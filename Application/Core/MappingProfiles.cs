using System.Linq;
using Application.Activities;
using Application.Activities.DTOs;
using Application.Comments;
using Application.Profiles;
using Domain;
using Profile = AutoMapper.Profile;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;
            
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName, opt => opt.MapFrom(activity => 
                    activity.Attendees.FirstOrDefault(u => u.IsHost).AppUser.UserName));
            
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(d => d.UserName, opt => opt.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(d => d.About, opt => opt.MapFrom(aa => aa.AppUser.About))
                .ForMember(d => d.Image, opt => opt.MapFrom(aa => aa.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(u => u.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, opt => opt.MapFrom(u => u.AppUser.Followings.Count))
                .ForMember(d => d.Following, 
                    opt => opt.MapFrom(u => u.AppUser.Followers.Any(x => x.Observer.UserName == currentUserName)));;

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, opt => opt.MapFrom(u => u.Photos.FirstOrDefault(photo => photo.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(u => u.Followers.Count))
                .ForMember(d => d.FollowingCount, opt => opt.MapFrom(u => u.Followings.Count))
                .ForMember(d => d.Following, 
                    opt => opt.MapFrom(u => u.Followers.Any(x => x.Observer.UserName == currentUserName)));

            CreateMap<ProfileEditInfo, AppUser>();

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.UserName, opt => opt.MapFrom(c => c.Author.UserName))
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(c => c.Author.DisplayName))
                .ForMember(d => d.Image, opt => opt.MapFrom(c => c.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}