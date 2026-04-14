Set objShell = CreateObject("WScript.Shell")
' PowerShell 스크립트를 창 없이(Hidden) 실행합니다.
objShell.Run "powershell.exe -ExecutionPolicy Bypass -File ""c:\Users\mrhu1\Desktop\블로그\auto_sync_watcher.ps1""", 0
