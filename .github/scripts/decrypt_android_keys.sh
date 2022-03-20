#!/bin/sh

# RELEASE KEYSTORE
echo "$RELEASE_KEYSTORE" > release.keystore.asc
gpg -d --passphrase="$RELEASE_KEYSTORE_PASSPHRASE" --batch release.keystore.asc > android/fastlane/croma.jks

# SERVICE ACCOUNT CREDENTIALS FILE
echo "$SERVICE_ACCOUNT" > service_account.json.asc
gpg -d --passphrase="$SERVICE_ACCOUNT_PASSPHRASE" --batch service_account.json.asc > android/fastlane/service_account.json

rm release.keystore.asc service_account.json.asc
