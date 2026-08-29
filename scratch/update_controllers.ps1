$files = Get-ChildItem -Path C:\Users\Cilse\source\xomtruyen\XomTruyen_Workspace\xmtruyen.API\Controllers -Recurse -Filter *.cs
foreach ($f in $files) { 
    $content = Get-Content $f.FullName -Raw
    if ($content -match 'catch \(Exception ex\)') { 
        $newContent = $content -replace 'ex\.Message', 'Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex)' -replace 'ex\.ToString\(\)', 'Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex)'
        if ($content -cne $newContent) { 
            Set-Content -Path $f.FullName -Value $newContent
            Write-Host "Updated $($f.Name)"
        } 
    } 
}
