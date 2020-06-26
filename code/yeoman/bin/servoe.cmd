@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\C:\Users\viruser.v-desktop\AppData\Local\Yarn\Data\link\servoe\lib\cli.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\C:\Users\viruser.v-desktop\AppData\Local\Yarn\Data\link\servoe\lib\cli.js" %*
)