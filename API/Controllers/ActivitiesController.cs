using System;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities([FromQuery] ActivityParams activityParams)
        {
            var result = await Mediator.Send(new ActivityList.Query {ActivityParams = activityParams});

            return ConvertToPagedHttpResponse(result);
        }

        [HttpGet("{guid}")]
        public async Task<IActionResult> GetActivity(Guid guid)
        {
            var result = await Mediator.Send(new ActivityDetails.Query{Id = guid});

            return ConvertToHttpResponse(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            var result = await Mediator.Send(new CreateActivity.Command {ActivityToCreate = activity});

            return ConvertToHttpResponse(result);
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{guid}")]
        public async Task<IActionResult> EditActivity(Guid guid, Activity activity)
        {
            activity.Id = guid;
            var result = await Mediator.Send(new EditActivity.Command {EditedActivity = activity});

            return ConvertToHttpResponse(result);
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{guid}")]
        public async Task<IActionResult> DeleteActivity(Guid guid)
        {
            var result = await Mediator.Send(new DeleteActivity.Command {Id = guid});
            return ConvertToHttpResponse(result);
        }

        [HttpPost("{guid}/attend")]
        public async Task<IActionResult> UpdateAttendance(Guid guid)
        {
            var result = await Mediator.Send(new UpdateAttendance.Command {Id = guid});
            return ConvertToHttpResponse(result);
        }
    }
}