@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - Location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a key stroke before ending
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%" == "" echo off
@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible command line name conflicts, use VALUE variables
set VALUE_COMMAND_LINE_ARGUMENTS=%*

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo Error: JAVA_HOME not found in your environment. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto init

echo.
echo Error: JAVA_HOME is set to an invalid directory. >&2
echo JAVA_HOME = "%JAVA_HOME%" >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:init
@REM Decide how to share directory names with spaces in they
set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set "DIRNAME=.\"
if "%DIRNAME:~-1%"=="\" set "DIRNAME=%DIRNAME:~0,-1%"

set "WRAPPER_JAR=%DIRNAME%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%DIRNAME%\.mvn\wrapper\maven-wrapper.properties"

@REM Check if the wrapper jar exists, if not, try to download it
if exist "%WRAPPER_JAR%" goto run

echo Downloading Maven wrapper jar...
set "DOWNLOAD_URL="
for /F "tokens=2 delims==" %%A in ('findstr /I /C:"wrapperUrl" "%WRAPPER_PROPERTIES%"') do set "DOWNLOAD_URL=%%A"

if "%DOWNLOAD_URL%" == "" (
    echo Error: Could not find wrapperUrl in %WRAPPER_PROPERTIES% >&2
    goto error
)

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')"
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to download Maven wrapper jar >&2
    goto error
)

:run
@REM Find the application home directory
set "MAVEN_PROJECTBASEDIR=%DIRNAME%"
:findBaseDir
if exist "%MAVEN_PROJECTBASEDIR%\.mvn" goto baseDirFound
set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\.."
goto findBaseDir

:baseDirFound
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

"%JAVA_HOME%\bin\java.exe" -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %VALUE_COMMAND_LINE_ARGUMENTS%
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
