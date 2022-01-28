using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Inferfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class CreateActivity
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity ActivityToCreate { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(p => p.ActivityToCreate).SetValidator(new ActivityValidator());
            }
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
                //connecting activity to user
                var user = await _dataContext.Users
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                var attendee = new ActivityAttendee()
                {
                    AppUser = user,
                    Activity = request.ActivityToCreate,
                    IsHost = true
                };
                
                request.ActivityToCreate.Attendees.Add(attendee);
                
                //adding activity to database
                _dataContext.Activities.Add(request.ActivityToCreate);
                var savedCount = await _dataContext.SaveChangesAsync();

                if (savedCount <= 0) 
                    return Result<Unit>.Failure("Failed to create an activity");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}