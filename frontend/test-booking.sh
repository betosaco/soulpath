#!/bin/bash

# ========================================================================================
# BOOKING SYSTEM TEST RUNNER SCRIPT
# ========================================================================================
# 
# This script provides easy access to the automated booking system tests
# 
# USAGE:
#   ./test-booking.sh [command]
# 
# COMMANDS:
#   test        Run tests only (default)
#   fix         Run tests and fix issues
#   watch       Watch for changes and auto-fix
#   validate    Validate specific files
#   help        Show help

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
    echo "🧪 Booking System Test Runner"
    echo ""
    echo "USAGE:"
    echo "  ./test-booking.sh [command]"
    echo ""
    echo "COMMANDS:"
    echo "  test        Run tests only (default)"
    echo "  fix         Run tests and fix issues"
    echo "  watch       Watch for changes and auto-fix"
    echo "  validate    Validate specific files"
    echo "  help        Show this help"
    echo ""
    echo "EXAMPLES:"
    echo "  ./test-booking.sh              # Run tests only"
    echo "  ./test-booking.sh fix          # Run tests and fix issues"
    echo "  ./test-booking.sh watch        # Watch for changes and auto-fix"
    echo "  ./test-booking.sh validate     # Validate all files"
}

# Function to run tests
run_tests() {
    print_status "Running cross-package booking tests..."
    node test-cross-package-booking.cjs
}

# Function to run tests with fixes
run_tests_with_fixes() {
    print_status "Running tests with automatic fixes..."
    node run-booking-tests.cjs --fix --verbose
}

# Function to watch for changes
watch_changes() {
    print_status "Starting file watcher for automatic fixes..."
    print_warning "Press Ctrl+C to stop watching"
    node run-booking-tests.cjs --watch
}

# Function to validate files
validate_files() {
    print_status "Validating all booking system files..."
    node run-booking-tests.cjs --validate --verbose
}

# Main script logic
case "${1:-test}" in
    "test")
        run_tests
        ;;
    "fix")
        run_tests_with_fixes
        ;;
    "watch")
        watch_changes
        ;;
    "validate")
        validate_files
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

# Check exit code and show result
if [ $? -eq 0 ]; then
    print_success "All tests completed successfully!"
else
    print_error "Some tests failed. Check the output above for details."
    exit 1
fi
