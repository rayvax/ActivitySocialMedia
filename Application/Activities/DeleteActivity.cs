using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class DeleteActivity
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;

            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activityToDelete = await _dataContext.Activities.FindAsync(request.Id);
                if (activityToDelete == null)
                    return null;

                _dataContext.Remove(activityToDelete);
                var savesCount = await _dataContext.SaveChangesAsync();

                if(savesCount <= 0)
                    return Result<Unit>.Failure("Failed to delete an activity");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}