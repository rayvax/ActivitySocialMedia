using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
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

            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _dataContext.Activities.Add(request.ActivityToCreate);
                var savedCount = await _dataContext.SaveChangesAsync();

                if (savedCount <= 0) 
                    return Result<Unit>.Failure("Failed to create an activity");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}