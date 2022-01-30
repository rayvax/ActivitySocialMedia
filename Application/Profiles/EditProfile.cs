using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Inferfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class EditProfile
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ProfileEditInfo profile { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.profile.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext dataContext, IUserAccessor userAccessor, IMapper mapper)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users
                    .FirstOrDefaultAsync(p => p.UserName == _userAccessor.GetUserName());
                if (user == null)
                    return null;

                _mapper.Map(request.profile, user);

                _dataContext.Entry(user).State = EntityState.Modified; //no bad request without changes
                var success = await _dataContext.SaveChangesAsync() > 0;

                return success
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Problem during editing profile");
            }
        }
    }
}