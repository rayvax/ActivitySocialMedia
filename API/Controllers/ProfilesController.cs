using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetProfile(string userName)
        {
            var result = await Mediator.Send(new ProfileDetails.Query {UserName = userName});
            return ConvertToHttpResponse(result);
        }

        [HttpPut]
        public async Task<IActionResult> SetProfile(ProfileEditInfo profileInfo)
        {
            var result = await Mediator.Send(new EditProfile.Command {profile = profileInfo});
            return ConvertToHttpResponse(result);
        }
    }
}