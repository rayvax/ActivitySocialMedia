using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> AddPhoto([FromForm] AddPhoto.Command command)
        {
            var result = await Mediator.Send(command);
            return ConvertToHttpResponse(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(string id)
        {
            var result = await Mediator.Send(new DeletePhoto.Command {Id = id});
            return ConvertToHttpResponse(result);
        }

        [HttpPost("{id}/setmain")]
        public async Task<IActionResult> SetMainPhoto(string id)
        {
            var result = await Mediator.Send(new SetMainPhoto.Command {Id = id});
            return ConvertToHttpResponse(result);
        }
    }
}