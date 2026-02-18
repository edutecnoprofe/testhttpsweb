
# Missing images to download via LoremFlickr (serves real Flickr images by keyword)
$images = @{
    "visit_gesu.jpg"       = "chiesa+gesu+rome+ceiling+baroque"
    "visit_ignacio.jpg"    = "sant+ignazio+rome+ceiling+fresco"
    "visit_cinecitta.jpg"  = "cinecitta+rome+studio"
    "visit_laterano.jpg"   = "laterano+basilica+rome+interior"
    "visit_san_luis.jpg"   = "caravaggio+saint+matthew+rome"
    "visit_pantheon.jpg"   = "pantheon+rome+interior+dome"
    "visit_trastevere.jpg" = "trastevere+rome+church+mosaic"
    "visit_catacumbas.jpg" = "catacomb+rome+fresco+ancient"
    "visit_altar.jpg"      = "altare+patria+rome+night"
    "visit_bramante.jpg"   = "tempietto+bramante+rome"
    "visit_gianicolo.jpg"  = "gianicolo+rome+panorama+view"
    "visit_san_pedro.jpg"  = "saint+peter+basilica+interior+vatican"
}

$outputDir = "public/assets/images"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir
}

foreach ($entry in $images.GetEnumerator()) {
    $localName = $entry.Key
    $keywords = $entry.Value
    $targetPath = Join-Path $outputDir $localName
    
    if (Test-Path $targetPath) {
        $size = (Get-Item $targetPath).Length
        if ($size -gt 50000) {
            Write-Host "Skipping $localName, already exists ($size bytes)."
            continue
        }
        else {
            Write-Host "Re-downloading $localName (previous was only $size bytes)."
        }
    }
    
    $url = "https://loremflickr.com/800/600/$keywords"
    Write-Host "Downloading $localName from $url..."
    
    curl.exe -s -L -o $targetPath -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" $url
    
    if (Test-Path $targetPath) {
        $fileSize = (Get-Item $targetPath).Length
        if ($fileSize -gt 10000) {
            Write-Host "SUCCESS: $localName ($([math]::Round($fileSize/1KB, 0)) KB)"
        }
        else {
            Write-Error "FAILED: $localName - too small ($fileSize bytes)"
        }
    }
    else {
        Write-Error "FAILED: $localName - file not created"
    }
    
    Start-Sleep -Seconds 1
}

# Clean up test files
Remove-Item "test_loremflickr.jpg" -ErrorAction SilentlyContinue
Remove-Item "test_pixabay.jpg" -ErrorAction SilentlyContinue
Remove-Item "test_colosseo.jpg" -ErrorAction SilentlyContinue
Remove-Item "test_colosseo2.jpg" -ErrorAction SilentlyContinue

Write-Host "`n=== DOWNLOAD COMPLETE ==="
Write-Host "Images in directory:"
Get-ChildItem $outputDir -Filter "visit_*.jpg" | ForEach-Object { Write-Host "  $($_.Name) - $([math]::Round($_.Length/1KB, 0)) KB" }
Write-Host "Total: $(( Get-ChildItem $outputDir -Filter 'visit_*.jpg' | Measure-Object).Count) images"
