# 🧪 Automated Booking System Test Suite

This automated test suite identifies and fixes cross-package booking issues in the wellness booking system. It provides comprehensive testing, automatic issue detection, and intelligent fixes.

## 🚀 Quick Start

### Run Tests
```bash
./test-booking.sh test
```

### Run Tests with Auto-Fix
```bash
./test-booking.sh fix
```

### Watch for Changes (Auto-Fix Mode)
```bash
./test-booking.sh watch
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `test` | Run tests only (default) |
| `fix` | Run tests and fix issues automatically |
| `watch` | Watch for file changes and auto-fix |
| `validate` | Validate all files without fixing |
| `help` | Show help information |

## 🔍 What the Tests Check

### 1. Missing `hasMultiplePackages` Props
- **Issue**: EnhancedSchedule components missing the `hasMultiplePackages` prop
- **Impact**: Cross-package booking won't work correctly
- **Auto-Fix**: Adds appropriate `hasMultiplePackages` logic based on context

### 2. Incorrect Slot Booking Logic
- **Issue**: `isSlotBooked` function doesn't handle multiple packages correctly
- **Impact**: Slots appear "booked" when they should allow cross-package booking
- **Auto-Fix**: Updates function to use conditional logic for multiple packages

### 3. Incomplete `existingBookings` Structure
- **Issue**: `existingBookings` missing `packageId` information
- **Impact**: Cannot track which package booked which slot
- **Auto-Fix**: Adds `packageId` and `packageName` to booking data structure

### 4. Missing Cross-Package Booking Logic
- **Issue**: Functions don't allow different packages to book the same slot
- **Impact**: Prevents cross-package booking entirely
- **Auto-Fix**: Updates logic to allow cross-package booking

### 5. Missing Flow Detection
- **Issue**: Missing enhanced flow detection for multiple packages
- **Impact**: Incorrect validation logic for different booking scenarios
- **Auto-Fix**: Adds proper flow detection logic

## 🛠️ Technical Details

### Test Files
- `test-cross-package-booking.cjs` - Main test suite
- `auto-fix-booking-system.cjs` - Automated fix system
- `run-booking-tests.cjs` - Test runner with options
- `test-booking.sh` - Easy-to-use shell script

### Monitored Files
- `components/MasterBookingFlow.tsx`
- `components/EnhancedSchedule.tsx`
- `components/ScheduleBookingFlow.tsx`

### Backup System
- Automatic backups created before applying fixes
- Backups stored in `backups/` directory
- Timestamp-based naming for easy rollback

## 🔧 How Auto-Fix Works

1. **Detection**: Scans files for known issue patterns
2. **Analysis**: Determines the appropriate fix based on context
3. **Backup**: Creates backup of original file
4. **Fix**: Applies intelligent fix based on issue type
5. **Verification**: Re-runs tests to confirm fix worked

## 📊 Test Results

The system provides detailed reports including:
- Total tests run
- Pass/fail counts
- Issues found and fixed
- Success rate percentage
- Detailed issue descriptions

## 🚨 Issue Severity Levels

- **High**: Critical issues that break cross-package booking
- **Medium**: Issues that may cause problems in certain scenarios
- **Low**: Minor issues that don't affect functionality

## 🔄 Rollback Capability

If a fix causes issues, you can rollback:
```bash
# The system automatically creates backups
# Check the backups/ directory for available rollback points
```

## 🎯 Cross-Package Booking Rules

The system enforces these rules:

✅ **Package A can book Slot X at 10:00 AM**  
✅ **Package B can also book Slot X at 10:00 AM** (different package types)  
✅ **Package A cannot book Slot X at 10:00 AM twice** (duplicate prevention within same package)  
✅ **Slot is only 'booked' when it reaches max capacity (999 for multiple packages)**

## 🚀 Integration with Development Workflow

### Pre-commit Hook
Add to your git hooks:
```bash
#!/bin/sh
./test-booking.sh test
```

### CI/CD Pipeline
```yaml
- name: Test Booking System
  run: ./test-booking.sh test
```

### Development Mode
```bash
# Watch for changes during development
./test-booking.sh watch
```

## 📈 Success Metrics

- **100% Test Pass Rate**: All cross-package booking scenarios work
- **Zero Manual Fixes**: All issues detected and fixed automatically
- **Real-time Monitoring**: Issues caught and fixed as they occur
- **Comprehensive Coverage**: All booking logic scenarios tested

## 🐛 Troubleshooting

### Common Issues

1. **"require is not defined"**
   - Solution: Files are using .cjs extension for CommonJS compatibility

2. **"File not found"**
   - Solution: Run from the frontend directory

3. **"Permission denied"**
   - Solution: Make script executable: `chmod +x test-booking.sh`

### Getting Help

Run the help command:
```bash
./test-booking.sh help
```

## 🔮 Future Enhancements

- [ ] Integration with VS Code extensions
- [ ] Real-time linting integration
- [ ] Performance testing for large datasets
- [ ] Visual diff reporting
- [ ] Integration with package managers

## 📝 Contributing

To add new tests or fixes:

1. Add test case to `test-cross-package-booking.cjs`
2. Add fix logic to `auto-fix-booking-system.cjs`
3. Update documentation
4. Test thoroughly

---

**🎉 The automated test system ensures your booking system works perfectly for all cross-package scenarios!**
