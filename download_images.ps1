
$images = @{
    'visit_bocca' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Bocca_della_verita.jpg/800px-Bocca_della_verita.jpg'
    'visit_argentina' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Largo_di_Torre_Argentina.jpg/800px-Largo_di_Torre_Argentina.jpg'
    'visit_gesu' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Interior_Gesu_Rome.jpg/800px-Interior_Gesu_Rome.jpg'
    'visit_ignacio' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sant_ignazio_ceiling.jpg/800px-Sant_ignazio_ceiling.jpg'
    'visit_cinecitta' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Cinecitt%C3%A0_-_Entrance.jpg/800px-Cinecitt%C3%A0_-_Entrance.jpg'
    'visit_laterano' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Basilica_di_San_Giovanni_in_Laterano_-_Interior_1.jpg/800px-Basilica_di_San_Giovanni_in_Laterano_-_Interior_1.jpg'
    'visit_colosseo_night' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Colosseo_di_notte_con_scia_bus.jpg/800px-Colosseo_di_notte_con_scia_bus.jpg'
    'visit_popolo' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Piazza_del_Popolo_%28Roma%2C_Italy%29.jpg/800px-Piazza_del_Popolo_%28Roma%2C_Italy%29.jpg'
    'visit_trevi' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Trevi_Fountain_-_Roma.jpg/800px-Trevi_Fountain_-_Roma.jpg'
    'visit_san_luis' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Caravaggio_-_The_Calling_of_Saint_Matthew.jpg/800px-Caravaggio_-_The_Calling_of_Saint_Matthew.jpg'
    'visit_pantheon' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Interior_Pantheon_Rome_2015_1.JPG/800px-Interior_Pantheon_Rome_2015_1.JPG'
    'visit_trastevere' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Santa_Maria_in_Trastevere_1_%2815767848396%29.jpg/800px-Santa_Maria_in_Trastevere_1_%2815767848396%29.jpg'
    'visit_priscilla' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Catacomb_of_Priscilla_-_Annunciation.jpg/800px-Catacomb_of_Priscilla_-_Annunciation.jpg'
    'visit_baroque' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/San_Carlo_alle_quattro_fontane_-_interior.jpg/800px-San_Carlo_alle_quattro_fontane_-_interior.jpg'
    'visit_coliseo_visit' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Panoramic_photograph_of_interior_of_Colosseum.jpg/800px-Panoramic_photograph_of_interior_of_Colosseum.jpg'
    'visit_capitolini' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Lupa_Capitolina,_Rome.jpg/800px-Lupa_Capitolina,_Rome.jpg'
    'visit_altar' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Altar_della_Patria_September_2015-1.jpg/800px-Altar_della_Patria_September_2015-1.jpg'
    'visit_montorio' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Tempietto_del_Bramante_Vorderseite.jpg/634px-Tempietto_del_Bramante_Vorderseite.jpg'
    'visit_vatican' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Vatican_Museums_Spiral_Staircase.jpg/800px-Vatican_Museums_Spiral_Staircase.jpg'
    'visit_moses' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Michelangelo-Moses.jpg/800px-Michelangelo-Moses.jpg'
    'visit_san_paolo' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Basilica_di_San_Paolo_fuori_le_mura_-_navata.jpg/800px-Basilica_di_San_Paolo_fuori_le_mura_-_navata.jpg'
    'visit_san_pedro' = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Saint_Peter%27s_Basillica_interior.jpg/800px-Saint_Peter%27s_Basillica_interior.jpg'
}

$destDir = "public/assets/images"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force }

$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

foreach ($name in $images.Keys) {
    $url = $images[$name]
    $path = "$destDir/$name.jpg"
    Write-Host "Downloading $name..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $path -UserAgent $ua
    } catch {
        Write-Host "Failed: $($_.Exception.Message)"
    }
}
