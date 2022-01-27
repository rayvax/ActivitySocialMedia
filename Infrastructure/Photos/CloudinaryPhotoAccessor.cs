using System;
using System.Threading.Tasks;
using Application.Inferfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class CloudinaryPhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        
        public CloudinaryPhotoAccessor(IOptions<CloudinarySettings> cloudinarySettings)
        {
            var account = new Account(
                cloudinarySettings.Value.CloudName,
                cloudinarySettings.Value.ApiKey,
                cloudinarySettings.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }
        
        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length <= 0)
                return null;

            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Width(500).Height(500).Crop("fill")
            };

            var uploadResult = _cloudinary.Upload(uploadParams);

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.ToString()
            };
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            if (publicId.Length <= 0)
                return null;
            
            var deletionParams = new DeletionParams(publicId);
            var deletionResult = await _cloudinary.DestroyAsync(deletionParams);

            return deletionResult.Result == "ok" ? deletionResult.Result : null;
        }
    }
}