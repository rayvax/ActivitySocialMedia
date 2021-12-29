using Application.Core;
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
            
            if (result.IsSuccess)
            {
                return result.Value == null
                    ? NotFound()
                    : Ok(result.Value);
            }

            return BadRequest(result.Error);
        }
    }
}