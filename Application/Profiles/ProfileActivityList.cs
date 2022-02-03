using System;
using System.Collections.Generic;
using System.Linq;
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
    public class ProfileActivityList
    {
        public class Query : IRequest<Result<List<ProfileActivityDto>>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; } //past, future, hosting
        }
        
        public class Handler : IRequestHandler<Query, Result<List<ProfileActivityDto>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;

            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext = dataContext;
                _mapper = mapper;
            }
            
            public async Task<Result<List<ProfileActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _dataContext.ActivityAttendees
                    .Where(a => a.AppUser.UserName == request.UserName)
                    .OrderBy(p => p.Activity.Date)
                    .ProjectTo<ProfileActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "hosting":
                        query = query.Where(a => a.HostUsename == request.UserName);
                        break;
                    case "past":
                        query = query.Where(a => a.Date < DateTime.UtcNow);
                        break;
                    default:
                        //future
                        query = query.Where(a => a.Date >= DateTime.UtcNow);
                        break;
                }

                var activities = await query.ToListAsync();
                return Result<List<ProfileActivityDto>>.Success(activities);
            }
        }
    }
}