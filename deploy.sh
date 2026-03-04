#!/bin/bash
rm -rf "/c/Users/searl/AppData/Local/Temp/claude/C--Users-searl--local-bin"
echo "=== Building ==="
npm run build && echo "=== Deploying ===" && vercel --prod
