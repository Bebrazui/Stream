@rem
@rem Copyright 2015-2022 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass any JVM options to Gradle and Java applications respectively.
set DEFAULT_JVM_OPTS=

set APP_NAME=Gradle
set APP_BASE_NAME=%~n0
set APP_HOME=%~dp0

@rem Resolve links: %0 may be a link
set "APP_HOME_REAL=%APP_HOME%"
for /F "delims=" %%A in ('dir /B /L "%APP_HOME%..\*" 2^>nul') do (
    if "%%~nxA" == ".." (
        pushd "%APP_HOME_REAL%.."
        set "APP_HOME_REAL=%CD%"
        popd
    )
)
set APP_HOME=%APP_HOME_REAL%

@rem Add a GRADLE_OPTS variable to pick up ownership from this script
set GRADLE_OPTS=
if not "%GRADLE_HOME%" == "" (
    set GRADLE_OPTS=-Dgradle.user.home="%GRADLE_HOME%" %GRADLE_OPTS%
)
if not "%GRADLE_USER_HOME%" == "" (
    set GRADLE_OPTS=-Dgradle.user.home="%GRADLE_USER_HOME%" %GRADLE_OPTS%
)
set GRADLE_OPTS=-Dapp.home="%APP_HOME%" %GRADLE_OPTS%

@rem Set the GRADLE_MAIN_CLASS
set GRADLE_MAIN_CLASS=org.gradle.wrapper.GradleWrapperMain

@rem Add the classpath to the command
set CLASSPATH=%APP_HOME%gradle\wrapper\gradle-wrapper.jar

@rem Check for a consistent java version
if not "%JAVACMD%" == "" goto :checkJava
if not "%JAVA_HOME%" == "" (
    if exist "%JAVA_HOME%\bin\java.exe" (
        set JAVACMD="%JAVA_HOME%\bin\java.exe"
    ) else (
        echo "Warning: JAVA_HOME points to an invalid directory: %JAVA_HOME%"
    )
)
if not defined JAVACMD (
    set JAVACMD=java.exe
)

:checkJava
%JAVACMD% -version > nul 2>&1
if %errorlevel% neq 0 (
    echo "Error: JAVA_HOME is not defined correctly or java is not in your path."
    goto :eof
)

@rem Set the JVM options
if not "%GRADLE_OPTS%" == "" goto :run
set GRADLE_OPTS=%DEFAULT_JVM_OPTS%

:run
@rem Execute Gradle
"%JAVACMD%" %GRADLE_OPTS% -cp "%CLASSPATH%" "%GRADLE_MAIN_CLASS%" %*

:eof
if "%OS%"=="Windows_NT" endlocal
