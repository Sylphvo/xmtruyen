using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace XomTruyen.API.Services.BookVideo
{
    public class TextSegment
    {
        public string Text { get; set; }
        public string SceneDescription { get; set; }
        public double EstimatedDurationSeconds { get; set; }
        public List<string> Keywords { get; set; }
    }

    public class SceneDescriptionService
    {
        /// <summary>
        /// Chia text thành segments + tạo scene description cho mỗi segment.
        /// </summary>
        public async Task<List<TextSegment>> AnalyzeAndSplitAsync(string chapterText, string genre, string style, int segmentWordCount = 150)
        {
            var rawSegments = SplitByParagraphs(chapterText, segmentWordCount);
            
            var results = new List<TextSegment>();
            
            foreach (var segment in rawSegments)
            {
                var keywords = ExtractKeywords(segment);
                var scenePrompt = await GenerateScenePromptAsync(segment, keywords, genre, style);
                
                results.Add(new TextSegment
                {
                    Text = segment,
                    SceneDescription = scenePrompt,
                    EstimatedDurationSeconds = EstimateReadingDuration(segment),
                    Keywords = keywords
                });
            }
            
            return results;
        }

        private List<string> SplitByParagraphs(string text, int targetWords)
        {
            if (string.IsNullOrWhiteSpace(text)) return new List<string>();

            // Tách theo dòng mới
            var paragraphs = text.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries)
                                 .Where(p => !string.IsNullOrWhiteSpace(p))
                                 .ToList();

            var segments = new List<string>();
            var currentSegment = "";
            var currentWordCount = 0;

            foreach (var p in paragraphs)
            {
                var wordCount = p.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries).Length;
                
                if (currentWordCount + wordCount > targetWords && currentWordCount > 0)
                {
                    segments.Add(currentSegment.Trim());
                    currentSegment = p + "\n";
                    currentWordCount = wordCount;
                }
                else
                {
                    currentSegment += p + "\n";
                    currentWordCount += wordCount;
                }
            }

            if (!string.IsNullOrWhiteSpace(currentSegment))
            {
                segments.Add(currentSegment.Trim());
            }

            return segments;
        }

        private async Task<string> GenerateScenePromptAsync(string text, List<string> keywords, string genre, string style)
        {
            // Rule-based scene description (Mock AI)
            var kwStr = keywords.Any() ? string.Join(", ", keywords) : "scenery, landscape";
            var prompt = $"{style} illustration, {genre} genre, scene: {kwStr}, cinematic lighting, detailed background, 16:9 aspect ratio";
            
            return await Task.FromResult(prompt);
        }

        private List<string> ExtractKeywords(string text)
        {
            // Simple keyword extraction mock
            // Trong thực tế sẽ gọi API NLP hoặc GPT để trích xuất danh từ riêng, nơi chốn.
            var keywords = new List<string>();
            if (text.Contains("núi") || text.Contains("mountain")) keywords.Add("mountain peak");
            if (text.Contains("rừng") || text.Contains("forest")) keywords.Add("deep forest");
            if (text.Contains("kiếm") || text.Contains("sword")) keywords.Add("holding sword");
            if (text.Contains("cô gái") || text.Contains("girl")) keywords.Add("beautiful girl");
            if (text.Contains("thành phố") || text.Contains("city")) keywords.Add("cityscape");
            
            if (!keywords.Any()) keywords.Add("character looking far away");
            
            return keywords;
        }

        private double EstimateReadingDuration(string text)
        {
            // Trung bình đọc 4 từ / giây tiếng Việt (~240 wpm)
            var wordCount = text.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries).Length;
            return wordCount / 4.0;
        }

        public static string GetStyleByGenre(string genre) => genre switch
        {
            "Tiên Hiệp" => "chinese fantasy art, cultivation immortal, ethereal mountains, martial arts",
            "Kiếm Hiệp" => "ancient chinese warrior, sword fight, misty mountains, wuxia style",
            "Ngôn Tình" => "romantic illustration, soft lighting, modern couple, pastel colors",
            "Đô Thị" => "modern city, urban lifestyle, photorealistic, contemporary",
            "Huyền Huyễn" => "dark fantasy, magical world, epic landscape, dramatic lighting",
            "Trinh Thám" => "noir detective, dark atmosphere, mystery, shadowy",
            "Sci-Fi" => "science fiction, futuristic city, neon lights, cyberpunk",
            _ => "digital art, illustration, cinematic, detailed"
        };
    }
}
