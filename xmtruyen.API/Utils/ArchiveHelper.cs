using System.Globalization;
using System.IO.Compression;
using System.Text.RegularExpressions;
using SharpCompress.Archives;

namespace Xmtruyen.API.Utils;

public class ArchiveChapterGroup
{
    public float ChapterNumber { get; set; }
    public string? Title { get; set; }
    public string RawGroupName { get; set; } = string.Empty;
    public List<ArchiveImageEntry> Images { get; set; } = new();
}

public class ArchiveImageEntry
{
    public string RelativePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public Func<Stream> OpenStream { get; set; } = null!;
}

public static class ArchiveHelper
{
    private static readonly HashSet<string> ValidImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".bmp"
    };

    private static readonly HashSet<string> IgnoredFilenames = new(StringComparer.OrdinalIgnoreCase)
    {
        ".ds_store", "thumbs.db", "desktop.ini"
    };

    public static bool IsValidArchive(string fileName)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        return ext is ".zip" or ".cbz" or ".rar" or ".cbr";
    }

    /// <summary>
    /// Natural string comparer to sort strings containing numbers logically (e.g., page 1, 2, ... 10, 11).
    /// </summary>
    public class NaturalStringComparer : IComparer<string>
    {
        public static readonly NaturalStringComparer Instance = new();

        public int Compare(string? x, string? y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;

            var regex = new Regex(@"(\d+)|(\D+)");
            var xMatches = regex.Matches(x);
            var yMatches = regex.Matches(y);

            int count = Math.Min(xMatches.Count, yMatches.Count);
            for (int i = 0; i < count; i++)
            {
                var xVal = xMatches[i].Value;
                var yVal = yMatches[i].Value;

                if (long.TryParse(xVal, out var xNum) && long.TryParse(yVal, out var yNum))
                {
                    int numCompare = xNum.CompareTo(yNum);
                    if (numCompare != 0) return numCompare;
                }
                else
                {
                    int strCompare = string.Compare(xVal, yVal, StringComparison.OrdinalIgnoreCase);
                    if (strCompare != 0) return strCompare;
                }
            }

            return xMatches.Count.CompareTo(yMatches.Count);
        }
    }

    /// <summary>
    /// Extracts chapter number and optional title from folder/file names like "Chap 1 - Khoi Dau", "Chapter 1.5", "02".
    /// </summary>
    public static (float ChapterNumber, string? Title) ParseChapterInfo(string rawName, float fallbackNumber)
    {
        var cleanName = rawName.Trim();

        // 1. Match common chapter prefixes: chap, chapter, chuong, tap, vol, volume
        var prefixRegex = new Regex(@"(?:chap(?:ter)?|chương|chuong|tập|tap|vol(?:ume)?|ep(?:isode)?)[^\d]*(\d+(?:[\.,]\d+)?)", RegexOptions.IgnoreCase);
        var match = prefixRegex.Match(cleanName);

        float chapterNum = fallbackNumber;
        string? title = null;

        if (match.Success)
        {
            var numStr = match.Groups[1].Value.Replace(',', '.');
            if (float.TryParse(numStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed))
            {
                chapterNum = parsed;
            }

            // Extract remaining text as title
            var afterMatch = cleanName.Substring(match.Index + match.Length).Trim();
            afterMatch = Regex.Replace(afterMatch, @"^[\s\-_:–—]+", "").Trim();
            if (!string.IsNullOrWhiteSpace(afterMatch))
            {
                title = afterMatch;
            }
        }
        else
        {
            // 2. Fallback: Find first number sequence in string
            var numberRegex = new Regex(@"(\d+(?:[\.,]\d+)?)");
            var numMatch = numberRegex.Match(cleanName);
            if (numMatch.Success)
            {
                var numStr = numMatch.Groups[1].Value.Replace(',', '.');
                if (float.TryParse(numStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed))
                {
                    chapterNum = parsed;
                }

                var afterMatch = cleanName.Substring(numMatch.Index + numMatch.Length).Trim();
                afterMatch = Regex.Replace(afterMatch, @"^[\s\-_:–—]+", "").Trim();
                if (!string.IsNullOrWhiteSpace(afterMatch))
                {
                    title = afterMatch;
                }
            }
        }

        return (chapterNum, title);
    }

    /// <summary>
    /// Extracts and groups image entries by chapter from a zip/cbz or rar/cbr archive stream or file.
    /// </summary>
    public static List<ArchiveChapterGroup> ExtractAndGroupArchive(Stream stream, string fileName, int? imagesPerChapter = null)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var rawEntries = new List<(string FullPath, Func<Stream> OpenStream)>();

        if (ext is ".zip" or ".cbz")
        {
            // Read via System.IO.Compression.ZipArchive
            // Read archive into a seekable memory stream if needed
            MemoryStream ms;
            if (stream is MemoryStream memStream)
            {
                ms = memStream;
            }
            else
            {
                ms = new MemoryStream();
                stream.CopyTo(ms);
                ms.Position = 0;
            }

            var zipArchive = new ZipArchive(ms, ZipArchiveMode.Read, leaveOpen: false);
            foreach (var entry in zipArchive.Entries)
            {
                if (entry.Length == 0) continue;
                var normalized = entry.FullName.Replace('\\', '/').TrimStart('/');
                if (IsIgnoredEntry(normalized)) continue;

                var entryExt = Path.GetExtension(normalized);
                if (!ValidImageExtensions.Contains(entryExt)) continue;

                // Capture local reference for closure
                var currentEntry = entry;
                rawEntries.Add((normalized, () => currentEntry.Open()));
            }
        }
        else
        {
            // SharpCompress for RAR / CBR
            MemoryStream ms;
            if (stream is MemoryStream memStream)
            {
                ms = memStream;
            }
            else
            {
                ms = new MemoryStream();
                stream.CopyTo(ms);
                ms.Position = 0;
            }

            var archive = ArchiveFactory.OpenArchive(ms);
            foreach (var entry in archive.Entries)
            {
                if (entry.IsDirectory || entry.Size == 0 || entry.Key == null) continue;
                var normalized = entry.Key.Replace('\\', '/').TrimStart('/');
                if (IsIgnoredEntry(normalized)) continue;

                var entryExt = Path.GetExtension(normalized);
                if (!ValidImageExtensions.Contains(entryExt)) continue;

                var currentEntry = entry;
                rawEntries.Add((normalized, () => currentEntry.OpenEntryStream()));
            }
        }

        if (rawEntries.Count == 0)
        {
            return new List<ArchiveChapterGroup>();
        }

        // Determine path structure and strip single root wrapper if present
        var pathSegmentsList = rawEntries.Select(e => e.FullPath.Split('/').ToList()).ToList();

        while (true)
        {
            int minSegments = pathSegmentsList.Min(p => p.Count);
            if (minSegments >= 2)
            {
                var firstRoot = pathSegmentsList[0][0];
                if (pathSegmentsList.All(p => p[0] == firstRoot))
                {
                    // Check if this root is a chapter folder or a wrapper
                    // If it parses to a chapter number (e.g. "Chap 1"), it might be a single chapter upload, don't strip
                    if (minSegments > 2 || ParseChapterInfo(firstRoot, -1).ChapterNumber == -1)
                    {
                        // Strip the wrapper root
                        foreach (var p in pathSegmentsList)
                        {
                            p.RemoveAt(0);
                        }
                        continue;
                    }
                }
            }
            break;
        }

        var groupedDict = new Dictionary<string, List<(string FullPath, string FileName, Func<Stream> OpenStream)>>(StringComparer.OrdinalIgnoreCase);

        // If imagesPerChapter is specified, we bypass folder grouping and just chunk the flat sorted list
        if (imagesPerChapter.HasValue && imagesPerChapter.Value > 0)
        {
            var sortedEntries = rawEntries
                .OrderBy(e => e.FullPath, NaturalStringComparer.Instance)
                .ToList();

            for (int i = 0; i < sortedEntries.Count; i++)
            {
                int chapterIdx = (i / imagesPerChapter.Value) + 1;
                string chapterFolder = $"Chapter {chapterIdx}";
                
                if (!groupedDict.TryGetValue(chapterFolder, out var list))
                {
                    list = new List<(string, string, Func<Stream>)>();
                    groupedDict[chapterFolder] = list;
                }
                
                var entry = sortedEntries[i];
                list.Add((entry.FullPath, Path.GetFileName(entry.FullPath), entry.OpenStream));
            }
        }
        else
        {
            // Original folder grouping logic
            for (int i = 0; i < rawEntries.Count; i++)
            {
                var parts = pathSegmentsList[i];
                var entry = rawEntries[i];

                string chapterFolder;
                string imgFileName = parts.Last();

                if (parts.Count > 1)
                {
                    chapterFolder = parts[0];
                }
                else
                {
                    // Flat structure without folders, try to group by filename prefix (e.g., "Chap 1_01.jpg" or default "Chapter 1")
                    var (chapNum, _) = ParseChapterInfo(imgFileName, 1);
                    chapterFolder = $"Chapter {chapNum}";
                }

                if (!groupedDict.TryGetValue(chapterFolder, out var list))
                {
                    list = new List<(string, string, Func<Stream>)>();
                    groupedDict[chapterFolder] = list;
                }

                list.Add((entry.FullPath, imgFileName, entry.OpenStream));
            }
        }

        // Build sorted result
        var result = new List<ArchiveChapterGroup>();
        int chapOrder = 1;

        foreach (var kvp in groupedDict)
        {
            var (chapNumber, title) = ParseChapterInfo(kvp.Key, chapOrder++);

            // Sort images naturally
            var sortedImages = kvp.Value
                .OrderBy(img => img.FileName, NaturalStringComparer.Instance)
                .Select(img => new ArchiveImageEntry
                {
                    RelativePath = img.FullPath,
                    FileName = img.FileName,
                    OpenStream = img.OpenStream
                })
                .ToList();

            result.Add(new ArchiveChapterGroup
            {
                ChapterNumber = chapNumber,
                Title = title,
                RawGroupName = kvp.Key,
                Images = sortedImages
            });
        }

        // Sort chapters by ChapterNumber ascending
        return result.OrderBy(c => c.ChapterNumber).ToList();
    }

    private static bool IsIgnoredEntry(string normalizedPath)
    {
        if (string.IsNullOrWhiteSpace(normalizedPath)) return true;
        if (normalizedPath.StartsWith("__MACOSX", StringComparison.OrdinalIgnoreCase) ||
            normalizedPath.Contains("/__MACOSX/", StringComparison.OrdinalIgnoreCase)) return true;

        var fileName = Path.GetFileName(normalizedPath);
        if (fileName.StartsWith("._", StringComparison.OrdinalIgnoreCase)) return true;
        if (IgnoredFilenames.Contains(fileName)) return true;

        return false;
    }
}
