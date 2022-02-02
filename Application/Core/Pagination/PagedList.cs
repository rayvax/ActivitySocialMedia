using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Core.Pagination
{
    public class PagedList<T> : List<T>
    {
        private PagedList(IEnumerable<T> items, int totalCount, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPagesCount = (int)Math.Ceiling(totalCount / (double) pageSize);
            PageSize = pageSize;
            TotalCount = totalCount;
            AddRange(items);
        }

        public int CurrentPage { get; }
        public int TotalPagesCount { get; }
        public int PageSize { get; }
        public int TotalCount { get; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var totalCount = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, totalCount, pageNumber, pageSize);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, PagingParams pagingParams)
        {
            return await CreateAsync(source, pagingParams.PageNumber, pagingParams.PageSize);
        }
    }
}