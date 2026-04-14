@echo off
setlocal
echo =======================================================
echo 🚀 블로그 자동 업데이트 시스템 (GitHub + Vercel)
echo =======================================================
echo.

echo [1/3] 변경된 내용을 확인하고 저장하는 중...
git add .
:: 현재 날짜와 시간을 포함한 커밋 메시지 생성
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a:%%b)
git commit -m "Auto Update: %date% %time%"

echo.
echo [2/3] GitHub 서버로 전송 중...
git push origin main

echo.
echo [3/3] Vercel 인터넷 배포 확인 중...
call npx vercel@latest --prod

echo.
echo =======================================================
echo ✅ 업데이트가 완료되었습니다! 
echo 1~2분 뒤에 블로그 주소로 접속해서 확인해 보세요.
echo =======================================================
pause