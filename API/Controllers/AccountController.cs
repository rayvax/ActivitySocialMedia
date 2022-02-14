using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers.VK_API;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly HttpClient _httpClient;

        public AccountController(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;

            _httpClient = new HttpClient
            {
                BaseAddress = new System.Uri("https://api.vk.com/method/")
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null)
                return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            return result.Succeeded
                ? CreateUserDto(user)
                : Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(p => p.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(p => p.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("userName", "Username taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserDto(user);
            }

            return BadRequest("Problem registering user");
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null)
                return BadRequest("Problem finding matching email for user");

            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == email);

            return CreateUserDto(user);
        }

        [HttpPost("vklogin")]
        public async Task<ActionResult<UserDto>> VkLogin(string accessToken, string email)
        {
            var paramsOfToken = $"access_token={accessToken}&v=5.131";

            var response = await _httpClient.GetAsync($"users.get?{paramsOfToken}&fields=email,photo_400_orig");

            if (!response.IsSuccessStatusCode)
                return Unauthorized();

            var content = await response.Content.ReadAsStringAsync();
            var vkUser = JsonConvertToVkUser(content);
            Console.WriteLine(vkUser);

            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == vkUser.UserName);
            
            if (user == null)
            {
                //register new vk user
                user = new AppUser
                {
                    DisplayName = vkUser.DisplayName,
                    Email = email,
                    UserName = vkUser.UserName,
                    Photos = new List<Photo>
                    {
                        new Photo
                        {
                            Id = vkUser.VkImageId, 
                            Url = vkUser.VkImageUrl, 
                            IsMain = true
                        }
                    }
                };
            
                var result = await _userManager.CreateAsync(user);
            
                if (!result.Succeeded)
                    BadRequest("Problem registering vk user");
            }
            
            return CreateUserDto(user);
        }

        private UserDto CreateUserDto(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName
            };
        }

        private VkUser JsonConvertToVkUser(string responseContent)
        {
            var vkUsersResponse = JsonConvert.DeserializeObject<VkUsersResponse>(responseContent);
            return vkUsersResponse.response[0];
        }
    }
}