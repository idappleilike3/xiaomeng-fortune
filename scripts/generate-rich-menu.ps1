Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root "assets\rich-menu-xiaomeng.png"

$width = 2500
$height = 1686
$cellW = [int]($width / 3)
$cellH = [int]($height / 2)

$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function New-Brush($hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function New-Pen($hex, $size) {
  return New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($hex)), $size
}

function Fill-RoundedRect($g, $brush, $x, $y, $w, $h, $radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $radius * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-CenteredText($g, $text, $font, $brush, $rect) {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($text, $font, $brush, $rect, $format)
  $format.Dispose()
}

$bgRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $bgRect, ([System.Drawing.ColorTranslator]::FromHtml("#170d25")), ([System.Drawing.ColorTranslator]::FromHtml("#342054")), 45
$graphics.FillRectangle($bgBrush, $bgRect)

$starBrush = New-Brush "#F5D38B"
$softBrush = New-Brush "#C9B8E8"
for ($i = 0; $i -lt 120; $i++) {
  $x = Get-Random -Minimum 0 -Maximum $width
  $y = Get-Random -Minimum 0 -Maximum $height
  $s = Get-Random -Minimum 2 -Maximum 7
  $graphics.FillEllipse($starBrush, $x, $y, $s, $s)
}

$titleFont = New-Object System.Drawing.Font "Microsoft JhengHei UI", 72, ([System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font "Microsoft JhengHei UI", 32, ([System.Drawing.FontStyle]::Regular)
$buttonFont = New-Object System.Drawing.Font "Microsoft JhengHei UI", 74, ([System.Drawing.FontStyle]::Bold)
$hintFont = New-Object System.Drawing.Font "Microsoft JhengHei UI", 28, ([System.Drawing.FontStyle]::Regular)
$iconFont = New-Object System.Drawing.Font "Segoe UI Symbol", 82, ([System.Drawing.FontStyle]::Regular)
$white = New-Brush "#FFF8EA"
$gold = New-Brush "#F5D38B"
$dark = New-Brush "#2B1745"
$linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(105, 245, 211, 139)), 4

$items = @(
  @{ Title = "生日"; Hint = "設定資料"; Icon = "✦"; Accent = "#F5D38B" },
  @{ Title = "塔羅"; Hint = "抽今日牌"; Icon = "☾"; Accent = "#FF8AB7" },
  @{ Title = "求籤"; Hint = "問事求籤"; Icon = "✧"; Accent = "#78E0D5" },
  @{ Title = "靈數"; Hint = "生日靈數"; Icon = "◇"; Accent = "#B79CFF" },
  @{ Title = "命盤"; Hint = "八字紫微"; Icon = "◎"; Accent = "#F4B860" },
  @{ Title = "市集"; Hint = "選品解鎖"; Icon = "✺"; Accent = "#9BE7A7" }
)

for ($index = 0; $index -lt $items.Count; $index++) {
  $col = $index % 3
  $row = [math]::Floor($index / 3)
  $x = $col * $cellW + 34
  $y = $row * $cellH + 34
  $w = $cellW - 68
  $h = $cellH - 68
  $item = $items[$index]

  $cardRect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
  $cardBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $cardRect, ([System.Drawing.Color]::FromArgb(225, 48, 28, 78)), ([System.Drawing.Color]::FromArgb(235, 19, 14, 35)), 135
  Fill-RoundedRect $graphics $cardBrush $x $y $w $h 52
  $graphics.DrawRectangle($linePen, $x + 10, $y + 10, $w - 20, $h - 20)

  $accent = New-Brush $item.Accent
  $graphics.FillEllipse($accent, $x + [int]($w / 2) - 68, $y + 88, 136, 136)
  $iconRect = New-Object System.Drawing.RectangleF ($x + [int]($w / 2) - 78), ($y + 78), 156, 156
  Draw-CenteredText $graphics $item.Icon $iconFont $dark $iconRect

  $titleRect = New-Object System.Drawing.RectangleF $x, ($y + 285), $w, 115
  Draw-CenteredText $graphics $item.Title $buttonFont $white $titleRect

  $hintRect = New-Object System.Drawing.RectangleF $x, ($y + 405), $w, 70
  Draw-CenteredText $graphics $item.Hint $hintFont $softBrush $hintRect

  $ctaRect = New-Object System.Drawing.RectangleF ($x + 125), ($y + 545), ($w - 250), 88
  Fill-RoundedRect $graphics $gold ([int]$ctaRect.X) ([int]$ctaRect.Y) ([int]$ctaRect.Width) ([int]$ctaRect.Height) 44
  Draw-CenteredText $graphics "開啟" $subFont $dark $ctaRect

  $cardBrush.Dispose()
  $accent.Dispose()
}

$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$bgBrush.Dispose()
$starBrush.Dispose()
$softBrush.Dispose()
$titleFont.Dispose()
$subFont.Dispose()
$buttonFont.Dispose()
$hintFont.Dispose()
$iconFont.Dispose()
$white.Dispose()
$gold.Dispose()
$dark.Dispose()
$linePen.Dispose()

Write-Host "Rich menu image generated: $output"
