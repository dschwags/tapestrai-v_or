#!/bin/bash

# Test Worker Deployment Script
# Tests if DeepSeek endpoint is accessible

echo "======================================"
echo "Testing Worker Deployment"
echo "======================================"
echo ""

WORKER_URL="https://tapestrai-worker.david-ec6.workers.dev"

echo "Testing endpoints..."
echo ""

# Test each endpoint
endpoints=("gemini" "openai" "anthropic" "perplexity" "deepseek")

for endpoint in "${endpoints[@]}"
do
    echo -n "Testing /api/$endpoint ... "
    status=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$WORKER_URL/api/$endpoint")
    
    if [ "$status" -eq 200 ]; then
        echo "✅ OK ($status)"
    else
        echo "❌ FAILED ($status)"
    fi
done

echo ""
echo "======================================"
echo "Testing DeepSeek with dummy key..."
echo "======================================"
echo ""

response=$(curl -s -X POST "$WORKER_URL/api/deepseek" \
    -H "Authorization: Bearer sk-dummy-test-key" \
    -H "Content-Type: application/json" \
    -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}],"max_tokens":10}')

echo "Response:"
echo "$response" | jq '.' 2>/dev/null || echo "$response"

echo ""
echo "======================================"
if echo "$response" | grep -q "401\|invalid\|unauthorized"; then
    echo "✅ SUCCESS! DeepSeek endpoint working!"
    echo "   (401/invalid is expected with dummy key)"
else
    echo "Check response above to verify endpoint is working"
fi
echo "======================================"
