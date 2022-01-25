using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Inferfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(p => p.Id == request.Id);
                
                if (activity == null)
                    return null;
                
                var user = await _dataContext.Users.FirstOrDefaultAsync(p => 
                    p.UserName == _userAccessor.GetUserName());
                
                if (user == null)
                    return null;
                
                var hostName = activity.Attendees.FirstOrDefault(a => a.IsHost)?.AppUser?.UserName;
                var attendance = activity.Attendees.FirstOrDefault(a => a.AppUser.UserName == user.UserName);
                
                if (attendance != null)
                {
                    if (user.UserName == hostName)
                    {
                        //host cannot quit his activity
                        activity.IsCancelled = !activity.IsCancelled;
                    }
                    else
                    {
                        //quit the activity
                        activity.Attendees.Remove(attendance);
                    }
                }
                else
                {
                    //attend the activity
                    attendance = new ActivityAttendee()
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendance);
                }

                var result = await _dataContext.SaveChangesAsync() > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}