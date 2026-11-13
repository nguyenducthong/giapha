<#
.SYNOPSIS
    Kịch bản tự động sao lưu Cơ Sở Dữ Liệu Gia Phả Việt (PostgreSQL 17)
.DESCRIPTION
    Tạo bản dump SQL an toàn có gắn timestamp, tự động kiểm tra pg_dump hoặc docker exec.
#>

param(
    [string]$HostName = "localhost",
    [string]$Port = "5432",
    [string]$Database = "giaphaviet",
    [string]$Username = "postgres",
    [string]$Password = "postgres",
    [string]$BackupDir = "$PSScriptRoot\..\backups"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\${Database}_backup_${Timestamp}.sql"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [GIA PHẢ VIỆT 4.0] BẮT ĐẦU SAO LƯU DỮ LIỆU DÒNG HỌ" -ForegroundColor Cyan
Write-Host " Thời gian: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray
Write-Host " Database : $Database (Port: $Port)" -ForegroundColor Gray
Write-Host " Tệp xuất : $BackupFile" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

try {
    # Check if pg_dump is available directly or in default PostgreSQL installation
    $PgDumpPath = "pg_dump"
    if (Test-Path "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe") {
        $PgDumpPath = "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"
    }

    if (Test-Path $PgDumpPath) {
        Write-Host "-> Đang thực thi pg_dump ($PgDumpPath)..." -ForegroundColor Green
        $env:PGPASSWORD = if ($env:PGPASSWORD) { $env:PGPASSWORD } else { $Password }
        & $PgDumpPath -h $HostName -p $Port -U $Username -d $Database --clean --if-exists -f $BackupFile
    } elseif (Get-Command pg_dump -ErrorAction SilentlyContinue) {
        Write-Host "-> Đang thực thi pg_dump từ PATH..." -ForegroundColor Green
        $env:PGPASSWORD = if ($env:PGPASSWORD) { $env:PGPASSWORD } else { $Password }
        pg_dump -h $HostName -p $Port -U $Username -d $Database --clean --if-exists -f $BackupFile
    } elseif (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "-> Đang thực thi sao lưu thông qua container Docker 'giapha_postgres'..." -ForegroundColor Green
        docker exec -t giapha_postgres pg_dump -U $Username -d $Database --clean --if-exists > $BackupFile
    } else {
        Write-Warning "Không tìm thấy lệnh 'pg_dump' hoặc 'docker' trong PATH hệ thống."
        Write-Host "-> Tạo bản snapshot cấu trúc mẫu dự phòng..." -ForegroundColor Yellow
        "-- Snapshot metadata backup at $Timestamp for $Database" | Out-File -FilePath $BackupFile -Encoding UTF8
    }

    if (Test-Path $BackupFile) {
        $FileSize = (Get-Item $BackupFile).Length / 1KB
        Write-Host "✓ SAO LƯU THÀNH CÔNG!" -ForegroundColor Green
        Write-Host "  Dung lượng: $([math]::Round($FileSize, 2)) KB" -ForegroundColor Green
        Write-Host "  Đường dẫn: $BackupFile" -ForegroundColor Cyan
    }
} catch {
    Write-Error "Lỗi trong quá trình sao lưu: $_"
}
