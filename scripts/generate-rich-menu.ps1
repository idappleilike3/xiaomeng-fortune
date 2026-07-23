Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root "assets\rich-menu-v5.png"

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
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $bgRect, ([System.Drawing.ColorTranslator]::FromHtml("#0D0718")), ([System.Drawing.ColorTranslator]::FromHtml("#2A1744")), 45
$graphics.FillRectangle($bgBrush, $bgRect)

$starBrush = New-Brush "#F5D38B"
for ($i = 0; $i -lt 100; $i++) {
  $x = Get-Random -Minimum 0 -Maximum $width
  $y = Get-Random -Minimum 0 -Maximum $height
  $s = Get-Random -Minimum 2 -Maximum 6
  $graphics.FillEllipse($starBrush, $x, $y, $s, $s)
}

$buttonFont = New-Object System.Drawing.Font "Microsoft JhengHei UI", 64, ([System.Drawing.FontStyle]::Bold)
$hintFont = New-Object System.Drawing.Font "Microsoft JhengHei UI", 28, ([System.Drawing.FontStyle]::Regular)
$iconFont = New-Object System.Drawing.Font "Segoe UI Symbol", 72, ([System.Drawing.FontStyle]::Regular)
$brandFont = New-Object System.Drawing.Font "Microsoft JhengHei UI", 36, ([System.Drawing.FontStyle]::Bold)
$white = New-Brush "#FFF8EA"
$gold = New-Brush "#F5D38B"
$soft = New-Brush "#C9B8E8"
$dark = New-Brush "#1A0F2D"
$linePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(120, 245, 211, 139)), 3

# Matches line/rich-menu.json v5.1 Erosée funnel (NOT 小夢 destiny gates)
$items = @(
  @{ Title = "開始解碼"; Hint = "免費三張牌"; Icon = "☾"; Accent = "#B780FF" },
  @{ Title = "查看方案"; Hint = "完整貨架"; Icon = "✦"; Accent = "#F5D38B" },
  @{ Title = "情感系列"; Hint = "關係解碼"; Icon = "♡"; Accent = "#FF8AB7" },
  @{ Title = "萌寵系列"; Hint = "毛孩心意"; Icon = "✧"; Accent = "#78E0D5" },
  @{ Title = "月費訂閱"; Hint = "持續陪伴"; Icon = "◎"; Accent = "#F4B860" },
  @{ Title = "邀請好友"; Hint = "分享連結"; Icon = "✺"; Accent = "#9BE7A7" }
)

for ($index = 0; $index -lt $items.Count; $index++) {
  $col = $index % 3
  $row = [math]::Floor($index / 3)
  $x = $col * $cellW + 28
  $y = $row * $cellH + 28
  $w = $cellW - 56
  $h = $cellH - 56
  $item = $items[$index]

  $cardRect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
  $cardBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $cardRect, ([System.Drawing.Color]::FromArgb(230, 48, 28, 78)), ([System.Drawing.Color]::FromArgb(240, 13, 7, 24)), 135
  Fill-RoundedRect $graphics $cardBrush $x $y $w $h 44
  $graphics.DrawRectangle($linePen, $x + 8, $y + 8, $w - 16, $h - 16)

  $accent = New-Brush $item.Accent
  $graphics.FillEllipse($accent, $x + [int]($w / 2) - 58, $y + 110, 116, 116)
  $iconRect = New-Object System.Drawing.RectangleF ($x + [int]($w / 2) - 70), ($y + 100), 140, 140
  Draw-CenteredText $graphics $item.Icon $iconFont $dark $iconRect

  $titleRect = New-Object System.Drawing.RectangleF $x, ($y + 280), $w, 100
  Draw-CenteredText $graphics $item.Title $buttonFont $white $titleRect

  $hintRect = New-Object System.Drawing.RectangleF $x, ($y + 390), $w, 60
  Draw-CenteredText $graphics $item.Hint $hintFont $soft $hintRect

  $cardBrush.Dispose()
  $accent.Dispose()
}

# Brand strip (no 小夢)
$brandRect = New-Object System.Drawing.RectangleF 0, ($height - 70), $width, 50
Draw-CenteredText $graphics "Erosée · 情感解碼" $brandFont $gold $brandRect

$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$bgBrush.Dispose()
$starBrush.Dispose()
$soft.Dispose()
$buttonFont.Dispose()
$hintFont.Dispose()
$iconFont.Dispose()
$brandFont.Dispose()
$white.Dispose()
$gold.Dispose()
$dark.Dispose()
$linePen.Dispose()

Write-Host "Rich menu image generated: $output"
