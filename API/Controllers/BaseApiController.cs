using API.Extensions;
using Application.Core;
using Application.Core.Pagination;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??=
            HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult ConvertToHttpResponse<T>(Result<T> result)
        {
            if (result == null)
                return NotFound();

            if (result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }

            if (result.IsSuccess && result.Value == null)
                return NotFound();

            return BadRequest(result.Error);
        }

        protected ActionResult ConvertToPagedHttpResponse<T>(Result<PagedList<T>> result)
        {
            if (result == null)
                return NotFound();

            if (result.IsSuccess && result.Value != null)
            {
                Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize,
                    result.Value.TotalCount, result.Value.TotalPagesCount);
                return Ok(result.Value);
            }

            if (result.IsSuccess && result.Value == null)
                return NotFound();

            return BadRequest(result.Error);
        }
    }
}