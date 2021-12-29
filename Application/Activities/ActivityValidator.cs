using Domain;
using FluentValidation;

namespace Application.Activities
{
    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(p => p.Title).NotEmpty();
            RuleFor(p => p.Description).NotEmpty();
            RuleFor(p => p.Date).NotEmpty();
            RuleFor(p => p.Category).NotEmpty();
            RuleFor(p => p.City).NotEmpty();
            RuleFor(p => p.Venue).NotEmpty();
        }
    }
}