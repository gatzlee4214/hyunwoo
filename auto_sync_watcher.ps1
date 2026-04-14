$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "c:\Users\mrhu1\Desktop\블로그"
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# 동기화가 너무 자주 일어나는 것을 방지하기 위한 시간 설정
$lastSync = Get-Date

$action = {
    $now = Get-Date
    # 마지막 동기화로부터 5초가 지난 경우에만 실행 (동시 저장 대응)
    if ($now -gt $lastSync.AddSeconds(5)) {
        $path = $Event.SourceEventArgs.FullPath
        $name = $Event.SourceEventArgs.Name
        
        # 임시 파일이나 .git 폴더 제외
        if ($path -notmatch "\\\.git\\" -and $name -notmatch "~$") {
            cd "c:\Users\mrhu1\Desktop\블로그"
            git add .
            git commit -m "Auto-sync (Watched change: $name)"
            git push origin main
            $global:lastSync = Get-Date
        }
    }
}

Register-ObjectEvent $watcher "Changed" -Action $action
Register-ObjectEvent $watcher "Created" -Action $action
Register-ObjectEvent $watcher "Deleted" -Action $action

while ($true) { Start-Sleep 5 }
