#!/bin/bash

# Vercel Environment Variables Manager
# Simple script to manage Vercel environment variables

case "$1" in
    "add")
        echo "📝 Adding environment variable: $2"
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "❌ Usage: $0 add <VARIABLE_NAME> <VALUE>"
            exit 1
        fi
        vercel env add "$2" production << EOF
$3
EOF
        ;;
    "list")
        echo "📋 Listing all environment variables..."
        vercel env ls
        ;;
    "remove")
        echo "🗑️  Removing environment variable: $2"
        if [ -z "$2" ]; then
            echo "❌ Usage: $0 remove <VARIABLE_NAME>"
            exit 1
        fi
        vercel env rm "$2" production
        ;;
    "deploy")
        echo "🚀 Deploying to production..."
        vercel --prod
        ;;
    *)
        echo "🔧 Vercel Environment Variables Manager"
        echo ""
        echo "Usage:"
        echo "  $0 add <VARIABLE_NAME> <VALUE>    - Add environment variable"
        echo "  $0 list                          - List all environment variables"
        echo "  $0 remove <VARIABLE_NAME>        - Remove environment variable"
        echo "  $0 deploy                         - Deploy to production"
        echo ""
        echo "Examples:"
        echo "  $0 add MY_VAR \"my value\""
        echo "  $0 list"
        echo "  $0 remove MY_VAR"
        echo "  $0 deploy"
        ;;
esac
