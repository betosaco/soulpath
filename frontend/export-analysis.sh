#!/bin/bash

# ========================================================================================
# BOOKING SYSTEM ANALYSIS EXPORTER SCRIPT
# ========================================================================================
# 
# This script exports all booking workflow, products, and schedule files
# into a single comprehensive text file for code analysis.
# 
# USAGE:
#   ./export-analysis.sh [options]
# 
# OPTIONS:
#   --output FILE    Specify output file name (default: booking-system-analysis.txt)
#   --verbose        Show detailed output
#   --help           Show help information

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
OUTPUT_FILE="booking-system-analysis.txt"
VERBOSE=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show help
show_help() {
    echo "📊 Booking System Analysis Exporter"
    echo ""
    echo "USAGE:"
    echo "  ./export-analysis.sh [options]"
    echo ""
    echo "OPTIONS:"
    echo "  --output FILE    Specify output file name (default: booking-system-analysis.txt)"
    echo "  --verbose        Show detailed output"
    echo "  --help           Show this help"
    echo ""
    echo "EXAMPLES:"
    echo "  ./export-analysis.sh                           # Export with default settings"
    echo "  ./export-analysis.sh --output my-analysis.txt  # Export to custom file"
    echo "  ./export-analysis.sh --verbose                 # Show detailed output"
    echo ""
    echo "DESCRIPTION:"
    echo "  This script exports all booking workflow, products, and schedule files"
    echo "  into a single comprehensive text file for code analysis. The exported"
    echo "  file includes:"
    echo "  - Complete source code of all booking-related files"
    echo "  - Behavior rules and logic documentation"
    echo "  - Component analysis and relationships"
    echo "  - Function and type definitions"
    echo "  - Import dependencies"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
done

# Main execution
print_status "Starting Booking System Analysis Export..."
print_status "Output file: $OUTPUT_FILE"

if [ "$VERBOSE" = true ]; then
    print_status "Verbose mode enabled"
fi

# Check if the export script exists
if [ ! -f "export-booking-analysis.cjs" ]; then
    print_error "Export script not found: export-booking-analysis.cjs"
    exit 1
fi

# Run the export script
print_status "Running analysis export..."

if [ "$VERBOSE" = true ]; then
    node export-booking-analysis.cjs
else
    node export-booking-analysis.cjs > /dev/null 2>&1
fi

# Check if the output file was created
if [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
    FILE_LINES=$(wc -l < "$OUTPUT_FILE")
    
    print_success "Analysis exported successfully!"
    print_status "File: $OUTPUT_FILE"
    print_status "Size: $FILE_SIZE"
    print_status "Lines: $FILE_LINES"
    
    if [ "$VERBOSE" = true ]; then
        print_status "First few lines of the analysis:"
        head -20 "$OUTPUT_FILE"
        echo ""
        print_status "Last few lines of the analysis:"
        tail -10 "$OUTPUT_FILE"
    fi
    
    print_status "The analysis file contains:"
    echo "  - Complete source code of all booking-related files"
    echo "  - Behavior rules and logic documentation"
    echo "  - Component analysis and relationships"
    echo "  - Function and type definitions"
    echo "  - Import dependencies"
    echo "  - Comprehensive code analysis for maintenance"
    
else
    print_error "Failed to create analysis file: $OUTPUT_FILE"
    exit 1
fi

print_success "Export completed successfully!"
