using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetFollowList(string userName, string predicate)
        {
            var result = await Mediator.Send(new FollowList.Query {Predicate = predicate, UserName = userName});
            return ConvertToHttpResponse(result);
        }
        
        [HttpPost("{target}")]
        public async Task<IActionResult> FollowToggle(string target)
        {
            var result = await Mediator.Send(new FollowToggle.Command {FollowTargetUserName = target});
            return ConvertToHttpResponse(result);
        }
    }
}