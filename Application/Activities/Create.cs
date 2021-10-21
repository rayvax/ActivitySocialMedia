using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity ActivityToCreate { get; set; }
        }
        
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _dataContext;

            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }
            
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _dataContext.Activities.Add(request.ActivityToCreate);

                await _dataContext.SaveChangesAsync();
                
                return Unit.Value;
            }
        }
    }
}