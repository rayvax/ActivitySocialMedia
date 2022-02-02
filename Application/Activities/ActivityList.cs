using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.DTOs;
using Application.Core;
using Application.Core.Pagination;
using Application.Inferfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class ActivityList
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public PagingParams PagingParams { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _dataContext.Activities
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                        new {currentUserName = _userAccessor.GetUserName()})
                    .AsQueryable();

                var list = await PagedList<ActivityDto>.CreateAsync(query, request.PagingParams.PageNumber, request.PagingParams.PageSize);
                return Result<PagedList<ActivityDto>>.Success(list);
            }
        }
    }
}