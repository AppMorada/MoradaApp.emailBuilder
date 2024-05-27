#!/bin/sh

CYAN='\033[0;36m'
ORANGE='\033[0;33m'
RESET_COLOR='\033[0m'

INFO_FLAG="[${CYAN}INFO${RESET_COLOR}]"
WARN_FLAG="[${ORANGE}WARN${RESET_COLOR}]"

FIRESTORE_GCP_PROJECT="link-manager-f612c"
FIRESTORE_DATABASE_ID="default"
FIRESTORE_EMULATOR_HOST=

ENABLE_EMULATOR=$1
if [ "${ENABLE_EMULATOR}" == "--emulator" ] || [ "${ENABLE_EMULATOR}" == "-e" ]; then
	echo -e "${INFO_FLAG} Mode: development"
	FIRESTORE_EMULATOR_HOST=127.0.0.0:8081
else
	echo -e "${INFO_FLAG} Mode: production"
fi

echo -e "${INFO_FLAG} Building project"
pnpm build;
BUILD_STATUS_CODE=$?
if [ $BUILD_STATUS_CODE -ne 0 ]; then
	echo -e "${WARN_FLAG} Something went wrong on build"
	exit $BUILD_STATUS_CODE
fi

echo -e "${INFO_FLAG} Sending email templates to firestore"
FIRESTORE_EMULATOR_HOST=$FIRESTORE_EMULATOR_HOST \
FIRESTORE_GCP_PROJECT=$FIRESTORE_GCP_PROJECT \
	node ./dist/emails/DO_NOT_MODIFY/generator.js

UPLOAD_STATUS_CODE=$?
if [ $UPLOAD_STATUS_CODE -ne 0 ]; then
	echo -e "${WARN_FLAG} Something went wrong on upload process"
	exit $UPLOAD_STATUS_CODE
fi

echo -e "${INFO_FLAG} Done"
exit 0
