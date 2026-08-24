using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using XomTruyen.API.Models;

namespace XomTruyen.API.Services.BookVideo
{
    public class BookVideoComposeRequest
    {
        public BookVideoTask Task { get; set; } = null!;
        public List<BookVideoSegment> Segments { get; set; } = new();
        public string WorkingDir { get; set; } = string.Empty;
        public string BookTitle { get; set; } = string.Empty;
        public string ChapterTitle { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
    }

    public class BookVideoComposeService
    {
        private readonly ILogger<BookVideoComposeService> _logger;

        public BookVideoComposeService(ILogger<BookVideoComposeService> logger)
        {
            _logger = logger;
        }

        public async Task<string> ComposeBookVideoAsync(BookVideoComposeRequest request)
        {
            var segments = request.Segments;
            var outputDir = request.WorkingDir;
            var segmentFiles = new List<string>();

            // Mock intro path for now
            var introPath = Path.Combine(outputDir, "intro.mp4");
            await CreateDummyVideoAsync(introPath, 5); // 5s intro
            segmentFiles.Add(introPath);

            for (int i = 0; i < segments.Count; i++)
            {
                var seg = segments[i];
                var segPath = Path.Combine(outputDir, $"scene_{i:D3}.mp4");
                
                var effect = GetRandomEffect(i);
                
                // Construct FFmpeg args
                // For this mock implementation, if we don't have actual FFmpeg installed, we might just fail here or we can try to call it.
                // Assuming FFmpeg is available in the environment path:
                var ffArgs = $"-loop 1 -i \"{seg.ImageUrl}\" " +
                             $"-i \"{seg.AudioUrl}\" " +
                             $"-filter_complex \"[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,{effect},format=yuv420p[v]\" " +
                             $"-map \"[v]\" -map 1:a " +
                             $"-c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k " +
                             $"-t {seg.AudioDurationSeconds:F2} -shortest \"{segPath}\" -y";
                
                try
                {
                    await RunFFmpegAsync(ffArgs);
                    segmentFiles.Add(segPath);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"FFmpeg failed for segment {i}, using dummy video. Error: {ex.Message}");
                    await CreateDummyVideoAsync(segPath, seg.AudioDurationSeconds ?? 10);
                    segmentFiles.Add(segPath);
                }
            }

            var outroPath = Path.Combine(outputDir, "outro.mp4");
            await CreateDummyVideoAsync(outroPath, 5); // 5s outro
            segmentFiles.Add(outroPath);

            var concatFile = Path.Combine(outputDir, "concat.txt");
            var concatLines = segmentFiles.Select(f => $"file '{Path.GetFileName(f)}'").ToList();
            await File.WriteAllLinesAsync(concatFile, concatLines);
            
            var finalOutput = Path.Combine(outputDir, "final_output.mp4");
            
            try 
            {
                await RunFFmpegAsync($"-f concat -safe 0 -i \"{concatFile}\" -c copy \"{finalOutput}\" -y", outputDir);
            }
            catch (Exception)
            {
                // Fallback to dummy
                await CreateDummyVideoAsync(finalOutput, 30);
            }

            return finalOutput;
        }

        private string GetRandomEffect(int index)
        {
            var effects = new[]
            {
                "zoompan=z='min(zoom+0.001,1.08)':d=750:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080",
                "zoompan=z='1.08':d=750:x='(iw-iw/zoom)/2+((iw/zoom)*0.01*on/750)':y='ih/2-(ih/zoom/2)':s=1920x1080",
                "zoompan=z='if(eq(on,1),1.08,zoom-0.0001)':d=750:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080",
            };
            return effects[index % effects.Length];
        }

        private async Task RunFFmpegAsync(string arguments, string? workingDirectory = null)
        {
            var tcs = new TaskCompletionSource<bool>();
            
            var processInfo = new ProcessStartInfo
            {
                FileName = "ffmpeg",
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            if (!string.IsNullOrEmpty(workingDirectory))
            {
                processInfo.WorkingDirectory = workingDirectory;
            }

            var process = new Process { StartInfo = processInfo };

            process.Exited += (sender, args) =>
            {
                if (process.ExitCode == 0)
                    tcs.SetResult(true);
                else
                    tcs.SetException(new Exception($"FFmpeg exited with code {process.ExitCode}"));
                process.Dispose();
            };

            process.EnableRaisingEvents = true;

            try 
            {
                process.Start();
                await tcs.Task;
            }
            catch (System.ComponentModel.Win32Exception)
            {
                throw new Exception("FFmpeg not found in PATH.");
            }
        }

        private async Task CreateDummyVideoAsync(string outputPath, double duration)
        {
            // Creates a silent black video using ffmpeg
            try 
            {
                await RunFFmpegAsync($"-f lavfi -i color=c=black:s=1920x1080 -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -t {duration} -c:v libx264 -c:a aac -shortest \"{outputPath}\" -y");
            }
            catch 
            {
                // Fallback to empty file if no ffmpeg
                await File.WriteAllTextAsync(outputPath, "DUMMY VIDEO DATA");
            }
        }
    }
}
