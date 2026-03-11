#!/bin/bash

MAX_MIND_ACCOUNT_ID=$MAX_MIND_ACCOUNT_ID
MAX_MIND_LICENSE_KEY=$MAX_MIND_LICENSE_KEY

echo "Downloading GeoDB for $MAX_MIND_ACCOUNT_ID and $MAX_MIND_LICENSE_KEY"

# Download GeoDB
curl -L -u "$MAX_MIND_ACCOUNT_ID:$MAX_MIND_LICENSE_KEY" \
  "https://download.maxmind.com/geoip/databases/GeoLite2-Country/download?suffix=tar.gz" \
  -o GeoLite2-Country.tar.gz
echo "GeoDB downloaded"

# Extract GeoDB
tar -xzf GeoLite2-Country.tar.gz
echo "GeoDB extracted"

# Move GeoDB to the correct location
mv GeoLite2-Country_*/GeoLite2-Country.mmdb ../GeoLite2-Country.mmdb
echo "GeoDB moved to the correct location"

# Clean up
rm -rf GeoLite2-Country_* GeoLite2-Country.tar.gz
echo "GeoDB cleaned up"