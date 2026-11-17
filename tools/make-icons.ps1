# Renders tools/icon.html to the PNG icons with headless Chrome.
#   powershell -File tools/make-icons.ps1 <output folder>
# Headless windows can't go below ~500 px, so every size is drawn in a 512 px window at a smaller device scale.
param([string]$OutDir = "icons")
$root = Split-Path $PSScriptRoot -Parent
$chrome = @("C:\Program Files\Google\Chrome\Application\chrome.exe", "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$src = "file:///" + ((Join-Path $PSScriptRoot "icon.html") -replace '\\', '/')
$dest = Join-Path $root $OutDir
New-Item -ItemType Directory -Force $dest | Out-Null
$sizes = @{ "apple-touch-icon.png" = 180; "icon-192.png" = 192; "icon-512.png" = 512; "favicon-32.png" = 32 }
foreach ($name in $sizes.Keys) {
  $scale = $sizes[$name] / 512
  & $chrome --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=5000 --window-size=512,512 "--force-device-scale-factor=$scale" "--screenshot=$(Join-Path $dest $name)" $src 2>$null | Out-Null
  Write-Output "$name  $($sizes[$name])px"
}
