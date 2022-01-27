using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Inferfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileDetails
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string UserName { get; set; }
        }
        
        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;

            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext = dataContext;
                _mapper = mapper;
            }
            
            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profile = await _dataContext.Users
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.UserName == request.UserName);
                
                return Result<Profile>.Success(profile);
            }
        }
    }
}