using System;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            var result = await Mediator.Send(new List.Query());

            return ConvertToHttpResponse(result);
        }

        [HttpGet("{guid}")]
        public async Task<IActionResult> GetActivity(Guid guid)
        {
            var result = await Mediator.Send(new Details.Query{Id = guid});

            return ConvertToHttpResponse(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            var result = await Mediator.Send(new Create.Command {ActivityToCreate = activity});

            return ConvertToHttpResponse(result);
        }

        [HttpPut("{guid}")]
        public async Task<IActionResult> EditActivity(Guid guid, Activity activity)
        {
            activity.Id = guid;
            var result = await Mediator.Send(new Edit.Command {EditedActivity = activity});

            return ConvertToHttpResponse(result);
        }

        [HttpDelete("{guid}")]
        public async Task<IActionResult> DeleteActivity(Guid guid)
        {
            var result = await Mediator.Send(new Delete.Command {Id = guid});
            return ConvertToHttpResponse(result);
        }
    }
}