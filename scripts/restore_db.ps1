<#
.SYNOPSIS
    Kịch bản khôi phục Cơ Sở Dữ Liệu Gia Phả Việt (PostgreSQL 17)
.DESCRIPTION
    Khôi phục nguyên trạng cơ sở dữ liệu từ tệp .sql đã sao lưu trước đó.
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$BackupFilePath,
    [string]$HostName = "localhost",
    [string]$Port = "5432",
    [string]$Database = "giaphaviet",
    [string]$Username = "postgres",
    [string]$BackupDir = "$PSScriptRoot\..\backups"
)

$ErrorActionPreference = "Stop"

if (-not $BackupFilePath) {
    # Tự động tìm tệp sao lưu mới nhất trong thư mục backups
    if (Test-Path $BackupDir) {
        $LatestFile = Get-ChildItem -Path $BackupDir -Filter "*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($LatestFile) {
            $BackupFilePath = $LatestFile.FullName
        }
    }
}

if (-not $BackupFilePath -or -not (Test-Path $BackupFilePath)) {
    Write-Error "Không tìm thấy tệp sao lưu hợp lệ. Vui lòng truyền tham số -BackupFilePath 'đường-dẫn-tệp.sql'."
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [GIA PHẢ VIỆT 4.0] BẮT ĐẦU KHÔI PHỤC DỮ LIỆU DÒNG HỌ" -ForegroundColor Cyan
Write-Host " Tệp khôi phục: $BackupFilePath" -ForegroundColor Yellow
Write-Host " Database đích: $Database (Port: $Port)" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

$Confirm = Read-Host "CẢNH BÁO: Dữ liệu hiện tại trong database sẽ được ghi đè. Bạn có chắc chắn muốn khôi phục? (Y/N)"
if ($Confirm -ne 'Y' -and $Confirm -ne 'y') {
    Write-Host "Đã hủy thao tác khôi phục." -ForegroundColor Yellow
    exit 0
}

try {
    $env:PGPASSWORD = if ($env:PGPASSWORD) { $env:PGPASSWORD } else { "postgrespassword" }

    $PsqlPath = "psql"
    if (Test-Path "C:\Program Files\PostgreSQL\17\bin\psql.exe") {
        $PsqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
    }

    if (Test-Path $PsqlPath) {
        Write-Host "-> Đang thực thi lệnh psql ($PsqlPath)..." -ForegroundColor Green
        & $PsqlPath -h $HostName -p $Port -U $Username -d $Database -f $BackupFilePath
    } elseif (Get-Command psql -ErrorAction SilentlyContinue) {
        Write-Host "-> Đang thực thi lệnh psql từ PATH..." -ForegroundColor Green
        psql -h $HostName -p $Port -U $Username -d $Database -f $BackupFilePath
    } elseif (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "-> Đang thực thi khôi phục qua Docker container 'giapha_postgres'..." -ForegroundColor Green
        Get-Content $BackupFilePath | docker exec -i giapha_postgres psql -U $Username -d $Database
    } else {
        Write-Error "Không tìm thấy lệnh 'psql' hoặc 'docker' trong hệ thống."
        exit 1
    }

    Write-Host "✓ KHÔI PHỤC THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "  Dữ liệu dòng họ đã được phục hồi nguyên vẹn." -ForegroundColor Cyan
} catch {
    Write-Error "Lỗi khi khôi phục cơ sở dữ liệu: $_"
}
