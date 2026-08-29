using System.Text;
using System.Text.RegularExpressions;

namespace Xmtruyen.API.Utils;

public static class SlugHelper
{
    public static string GenerateSlug(string phrase)
    {
        string str = RemoveDiacritics(phrase).ToLower();
        
        // invalid chars           
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        // convert multiple spaces into one space   
        str = Regex.Replace(str, @"\s+", " ").Trim();
        // cut and trim 
        str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
        str = Regex.Replace(str, @"\s", "-"); // hyphens   
        
        return str;
    }

    public static string GenerateSlugWithRandomSuffix(string phrase)
    {
        var slug = GenerateSlug(phrase);
        var suffix = Guid.NewGuid().ToString("N").Substring(0, 6);
        return $"{slug}-{suffix}";
    }

    private static string RemoveDiacritics(string text)
    {
        var stringBuilder = new StringBuilder();
        var normalizedString = text.Normalize(NormalizationForm.FormD);

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                if (c == 'đ') stringBuilder.Append('d');
                else if (c == 'Đ') stringBuilder.Append('D');
                else stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}
