using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{guid}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid guid)
        {
            return await Mediator.Send(new Details.Query{Id = guid});
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command {ActivityToCreate = activity}));
        }

        [HttpPut("{guid}")]
        public async Task<IActionResult> EditActivity(Guid guid, Activity activity)
        {
            activity.Id = guid;

            return Ok(await Mediator.Send(new Edit.Command {EditedActivity = activity}));
        }

        [HttpDelete("{guid}")]
        public async Task<IActionResult> DeleteActivity(Guid guid)
        {
            return Ok(await Mediator.Send(new Delete.Command {Id = guid}));
        }
    }
}