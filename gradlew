#!/usr/bin/env bash

#
# Copyright 2015-2022 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#


#
# A simple script to show how to use the Gradle wrapper.
# You can use this script to build the samples and the project itself.
# To build the project, run `./gradlew build`
#

set -e

# Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass any JVM options to Gradle and Java applications respectively.
DEFAULT_JVM_OPTS=

APP_NAME="Gradle"
APP_BASE_NAME=`basename "$0"`

# Use the maximum available, or set MAX_FD != -1 to use that value.
MAX_FD="maximum"

# OS specific support.  $var _must_ be set to either true or false.
cygwin=false
darwin=false
linux=false

case "`uname`" in
  CYGWIN*) cygwin=true ;;
  Darwin*) darwin=true ;;
  Linux*) linux=true ;;
esac

# For Cygwin, ensure paths are in UNIX format before anything is touched
if ${cygwin} ; then
  [ -n "${JAVA_HOME}" ] && JAVA_HOME=`cygpath --unix "${JAVA_HOME}"`
  [ -n "${GRADLE_HOME}" ] && GRADLE_HOME=`cygpath --unix "${GRADLE_HOME}"`
fi

# Attempt to set APP_HOME
# Resolve links: $0 may be a link
PRG="$0"
# Need this for relative symlinks.
while [ -h "${PRG}" ] ; do
  ls=`ls -ld "${PRG}"`
  link=`expr "${ls}" : '[^d]*d.* -> \(.*\)$'`
  if expr "${link}" : '/.*' > /dev/null; then
    PRG="${link}"
  else
    PRG=`dirname "${PRG}"`"/${link}"
  fi
done

APP_HOME=`dirname "${PRG}"`

# Add a GRADLE_OPTS variable to pick up ownership from this script
if [ -z "${GRADLE_OPTS}" ] ; then
  GRADLE_OPTS=""
fi

# Add the GRADLE_HOME to the GRADLE_OPTS
if [ -n "${GRADLE_HOME}" ] ; then
  GRADLE_OPTS="-Dgradle.user.home=\"${GRADLE_HOME}\" ${GRADLE_OPTS}"
fi

# Add the GRADLE_USER_HOME to the GRADLE_OPTS
if [ -n "${GRADLE_USER_HOME}" ] ; then
  GRADLE_OPTS="-Dgradle.user.home=\"${GRADLE_USER_HOME}\" ${GRADLE_OPTS}"
fi

# Add the APP_HOME to the GRADLE_OPTS
GRADLE_OPTS="-Dapp.home=\"${APP_HOME}\" ${GRADLE_OPTS}"

# For Cygwin, switch paths to Windows format before running java
if ${cygwin} ; then
  [ -n "${JAVA_HOME}" ] && JAVA_HOME=`cygpath --path --windows "${JAVA_HOME}"`
  [ -n "${GRADLE_HOME}" ] && GRADLE_HOME=`cygpath --path --windows "${GRADLE_HOME}"`
  [ -n "${GRADLE_USER_HOME}" ] && GRADLE_USER_HOME=`cygpath --path --windows "${GRADLE_USER_HOME}"`
  [ -n "${APP_HOME}" ] && APP_HOME=`cygpath --path --windows "${APP_HOME}"`
fi

# Set the GRADLE_MAIN_CLASS
GRADLE_MAIN_CLASS=org.gradle.wrapper.GradleWrapperMain

# Add the classpath to the command
CLASSPATH=${APP_HOME}/gradle/wrapper/gradle-wrapper.jar

# Check for a consistent java version
if [ -z "${JAVACMD}" ] ; then
  if [ -n "${JAVA_HOME}"  ] ; then
    if [ -x "${JAVA_HOME}/jre/sh/java" ] ; then
      # IBM's JDK on AIX uses jre/sh/java
      JAVACMD="${JAVA_HOME}/jre/sh/java"
    else
      JAVACMD="${JAVA_HOME}/bin/java"
    fi
  else
    JAVACMD="java"
  fi
fi

if [ ! -x "${JAVACMD}" ] ; then
  echo "Error: JAVA_HOME is not defined correctly."
  echo "  We cannot execute ${JAVACMD}"
  exit 1
fi

# Increase the maximum file descriptors if we can.
if [ "${cygwin}" = "false" ] ; then
  MAX_FD_LIMIT=`ulimit -H -n`
  if [ "${MAX_FD_LIMIT}" != "unlimited" ] ; then
    if [ "${MAX_FD}" = "maximum" -o "${MAX_FD}" = "max" ] ; then
      MAX_FD=${MAX_FD_LIMIT}
    fi

    if [ ${MAX_FD} -gt ${MAX_FD_LIMIT} ] ; then
      echo "Cannot set file descriptor limit to ${MAX_FD}, exceeds hard limit of ${MAX_FD_LIMIT}."
      MAX_FD=${MAX_FD_LIMIT}
    fi

    ulimit -n ${MAX_FD}
    if [ $? -ne 0 ] ; then
      echo "Could not set file descriptor limit to ${MAX_FD}"
    fi
  fi
fi

# Set the JVM options
if [ -z "${GRADLE_OPTS}" ] ; then
  GRADLE_OPTS="${DEFAULT_JVM_OPTS}"
fi

# Add the GRADLE_OPTS to the command
exec "${JAVACMD}" ${GRADLE_OPTS} -cp "${CLASSPATH}" "${GRADLE_MAIN_CLASS}" "$@"
