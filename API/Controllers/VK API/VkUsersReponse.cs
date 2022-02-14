namespace API.Controllers.VK_API
{
    public class VkUsersResponse
    {
        public VkUser[] response { get; set; }
    }
    
    public class VkUser
    {
        public string id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string photo_400_orig { get; set; }

        public string UserName => "vk_" + id;
        public string DisplayName => first_name + " " + last_name;
        public string VkImageUrl => photo_400_orig;
        public string VkImageId => "vk_img_" + id;
    }
}