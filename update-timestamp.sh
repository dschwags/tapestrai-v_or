#!/bin/bash
# Auto-update build timestamp in index.html
# Usage: ./update-timestamp.sh

FILE="index.html"
TIMESTAMP=$(TZ="America/New_York" date "+%Y-%m-%d %H:%M EDT")

# Update the version comment line
sed -i.bak "s/Build: [^>]*/Build: $TIMESTAMP/" "$FILE"

echo "✅ Updated timestamp to: $TIMESTAMP"
echo "   File: $FILE"

# Show the updated line
grep "Version:" "$FILE" | head -1
