$folders = @("Repositories", "Services", "Controllers", "Models\Requests", "Models\Responses")

foreach ($folder in $folders) {
    $files = Get-ChildItem -Path $folder -Filter "*.cs" -Recurse
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw
        
        # We need to be careful with replacements.
        $content = $content -replace '\bBookId\b', 'PublicationId'
        $content = $content -replace '\bbookId\b', 'publicationId'
        $content = $content -replace '\bBooks\b', 'Publications'
        $content = $content -replace '\bbooks\b', 'publications'
        $content = $content -replace '\bBook\b', 'Publication'
        $content = $content -replace '\bbook\b', 'publication'
        
        $content = $content -replace '\bBookCategory\b', 'PublicationCategory'
        $content = $content -replace '\bBookTopic\b', 'PublicationTopic'
        $content = $content -replace '\bBookListResponse\b', 'PublicationListResponse'
        $content = $content -replace '\bBookFilterRequest\b', 'PublicationFilterRequest'
        $content = $content -replace '\bBookRequest\b', 'PublicationRequest'
        $content = $content -replace '\bBookUpdateRequest\b', 'PublicationUpdateRequest'
        $content = $content -replace '\bUserBook\b', 'UserPublication'
        
        # Just in case we replaced something like "PublicationCategories" with "PublicationCategorys"
        $content = $content -replace '\bPublicationCategorys\b', 'PublicationCategories'
        $content = $content -replace '\bPublicationTopics\b', 'PublicationTopics'
        
        # Some specific ones for variables
        $content = $content -replace '\bbookCategories\b', 'publicationCategories'
        $content = $content -replace '\bbookTopics\b', 'publicationTopics'
        
        Set-Content -Path $file.FullName -Value $content
    }
}
