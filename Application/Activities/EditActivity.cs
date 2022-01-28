using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class EditActivity
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity EditedActivity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(p => p.EditedActivity).SetValidator(new ActivityValidator());
            }
        }
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;

            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext = dataContext;
                _mapper = mapper;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.EditedActivity.Id);
                if (activity == null)
                    return null;

                _mapper.Map(request.EditedActivity, activity);
                var savesCount = await _dataContext.SaveChangesAsync();

                if (savesCount <= 0)
                    return Result<Unit>.Failure("Failed to edit an activity");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}