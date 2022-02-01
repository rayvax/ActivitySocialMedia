using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Inferfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<FollowingStatus>>
        {
            public string FollowTargetUserName { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<FollowingStatus>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }
            
            public async Task<Result<FollowingStatus>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _dataContext.Users
                    .FirstOrDefaultAsync(p => p.UserName == _userAccessor.GetUserName());

                if (observer == null)
                    return null;

                var target = await _dataContext.Users
                    .FirstOrDefaultAsync(p => p.UserName == request.FollowTargetUserName);

                if (target == null)
                    return null;

                bool result;
                var following = await _dataContext.UserFollowings.FindAsync(observer.Id, target.Id);
                if (following == null)
                {
                    //follow
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target,
                    };

                    _dataContext.UserFollowings.Add(following);
                    result = true;
                }
                else
                {
                    //unfollow
                    _dataContext.UserFollowings.Remove(following);
                    result = false;
                }

                var success = await _dataContext.SaveChangesAsync() > 0;

                return success
                    ? Result<FollowingStatus>.Success(new FollowingStatus {Following = result})
                    : Result<FollowingStatus>.Failure("Problem updating following");
            }
        }
    }
}