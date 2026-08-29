using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Xmtruyen.API.Services.BookVideo
{
    public interface IImageGenerationService
    {
        Task<string> GenerateImageAsync(string prompt, string outputPath, string provider = "stable-diffusion");
    }

    public class ImageGenerationService : IImageGenerationService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public ImageGenerationService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> GenerateImageAsync(string prompt, string outputPath, string provider = "stable-diffusion")
        {
            return provider switch
            {
                "dall-e" => await GenerateWithDallE(prompt, outputPath),
                "stable-diffusion" => await GenerateWithStableDiffusion(prompt, outputPath),
                "stock" => await FetchStockImage(prompt, outputPath),
                _ => throw new ArgumentException($"Unknown provider: {provider}")
            };
        }

        private async Task<string> GenerateWithDallE(string prompt, string outputPath)
        {
            // Placeholder: Call OpenAI DALL-E 3 API
            // For now, we mock it by returning a stock image
            return await FetchStockImage(prompt, outputPath);
        }

        private async Task<string> GenerateWithStableDiffusion(string prompt, string outputPath)
        {
            // Placeholder: Call Local Stable Diffusion WebUI API
            // For now, we mock it by returning a stock image
            return await FetchStockImage(prompt, outputPath);
        }

        private async Task<string> FetchStockImage(string keywords, string outputPath)
        {
            // We use a dummy image service like Unsplash Source or Placehold.co to avoid needing an API key during dev
            // var url = $"https://source.unsplash.com/1920x1080/?{Uri.EscapeDataString(keywords)}"; // Deprecated
            var encodedKeywords = Uri.EscapeDataString(keywords.Split(',')[0].Trim());
            var url = $"https://image.pollinations.ai/prompt/{encodedKeywords}?width=1920&height=1080&nologo=true";
            
            var imageBytes = await _httpClient.GetByteArrayAsync(url);
            await System.IO.File.WriteAllBytesAsync(outputPath, imageBytes);
            return outputPath;
        }
    }
}
