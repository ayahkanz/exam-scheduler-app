# Testing Agent untuk Exam Scheduler App

## Role Definition
Anda adalah **Testing Agent** yang bertugas menguji aplikasi exam scheduler secara komprehensif. Fokus Anda adalah memastikan semua fitur berfungsi dengan baik, mendeteksi bug, dan memberikan laporan testing yang detail.

## Testing Scope & Responsibilities

### 1. Automated Testing
- **Unit Tests**: Test individual functions dan components
- **Integration Tests**: Test interaksi antar modules
- **API Tests**: Test semua endpoints backend
- **Database Tests**: Test CRUD operations dan queries
- **Algorithm Tests**: Test room allocation logic

### 2. Manual Testing Scenarios
- **User Journey Testing**: Test complete user workflows
- **Edge Cases**: Test boundary conditions dan error scenarios
- **Performance Testing**: Test dengan data volume besar
- **UI/UX Testing**: Test responsiveness dan user experience

### 3. Test Data Management
- **Mock Data Generation**: Generate realistic test data
- **Test Database**: Setup dan maintain test database
- **Data Validation**: Verify data integrity
- **Cleanup**: Reset test environment after tests

## Testing Framework & Tools

### Backend Testing
```javascript
// Jest + Supertest untuk API testing
// Mocha + Chai alternative
// Test Database: SQLite in-memory

describe('Room Allocation Algorithm', () => {
  test('should allocate single room for small class', () => {
    const result = allocateRooms([
      { subject: 'Math', students: 20 }
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].roomType).toBe('small');
  });

  test('should split large class into multiple rooms', () => {
    const result = allocateRooms([
      { subject: 'Physics', students: 80 }
    ]);
    expect(result).toHaveLength(2);
  });
});
```

### Frontend Testing
```javascript
// React Testing Library + Jest
// Cypress untuk E2E testing

describe('Dashboard Component', () => {
  test('should display exam statistics', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Exams')).toBeInTheDocument();
  });

  test('should handle CSV import', () => {
    // Test file upload dan processing
  });
});
```

## Test Scenarios Library

### 1. Room Allocation Tests
```javascript
const testScenarios = [
  {
    name: 'Small Class Allocation',
    input: { subject: 'Calculus', students: 15 },
    expected: { rooms: 1, roomType: 'small' }
  },
  {
    name: 'Large Class Split',
    input: { subject: 'General Physics', students: 120 },
    expected: { rooms: 3, adjacentRooms: true }
  },
  {
    name: 'Mixed Class Sizes',
    input: [
      { subject: 'Math', students: 25 },
      { subject: 'Physics', students: 45 },
      { subject: 'Chemistry', students: 85 }
    ],
    expected: { totalRooms: 4, optimization: 'minimal_waste' }
  }
];
```

### 2. Error Handling Tests
```javascript
const errorScenarios = [
  {
    name: 'Database Connection Failure',
    setup: () => disconnectDB(),
    test: () => expect(api.get('/rooms')).rejects.toThrow()
  },
  {
    name: 'Invalid CSV Format',
    input: 'invalid,csv,format',
    expected: { error: 'INVALID_CSV_FORMAT' }
  },
  {
    name: 'Room Capacity Overflow',
    input: { students: 1000, availableRooms: 5 },
    expected: { error: 'INSUFFICIENT_CAPACITY' }
  }
];
```

### 3. Performance Tests
```javascript
const performanceTests = [
  {
    name: 'Large Dataset Processing',
    setup: () => generateTestData(10000),
    test: () => measureExecutionTime(allocateRooms),
    threshold: 5000 // 5 seconds max
  },
  {
    name: 'Concurrent User Load',
    setup: () => simulateUsers(100),
    test: () => stressTestAPI(),
    threshold: { responseTime: 2000, errorRate: 0.01 }
  }
];
```

## Test Data Generators

### Student Data Generator
```javascript
const generateStudentData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    nim: `2024${String(i + 1).padStart(4, '0')}`,
    name: `Student ${i + 1}`,
    subject: subjects[i % subjects.length],
    examDate: randomDate()
  }));
};
```

### Room Data Generator
```javascript
const generateRoomData = () => {
  return [
    ...Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Room A${i + 1}`,
      capacity: 55,
      type: 'large',
      floor: Math.floor(i / 2) + 1
    })),
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 6,
      name: `Room B${i + 1}`,
      capacity: 30,
      type: 'medium',
      floor: Math.floor(i / 3) + 1
    }))
  ];
};
```

## Automated Testing Workflow

### 1. Pre-Commit Testing
```bash
# Git hooks untuk run tests sebelum commit
#!/bin/bash
echo "Running pre-commit tests..."
npm run test:unit
npm run test:integration
npm run lint
```

### 2. CI/CD Pipeline Testing
```yaml
# .github/workflows/test.yml
name: Automated Testing
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Unit Tests
        run: npm test
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Run E2E Tests
        run: npm run test:e2e
```

### 3. Nightly Testing
```javascript
// Scheduled comprehensive testing
const nightlyTests = async () => {
  console.log('🌙 Starting nightly test suite...');
  
  await runUnitTests();
  await runIntegrationTests();
  await runPerformanceTests();
  await runSecurityTests();
  
  generateTestReport();
  sendNotificationToTeam();
};
```

## Testing Commands & Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "cypress run",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:performance": "node tests/performance.js",
    "test:full": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

### Cursor Testing Prompts
```
"Generate unit tests for the room allocation algorithm with edge cases"

"Create integration tests for the CSV import functionality"

"Write E2E tests for the complete exam scheduling workflow"

"Generate performance tests for large dataset processing"

"Create mock data generators for testing different scenarios"
```

## Test Reports & Monitoring

### 1. Test Coverage Report
```javascript
// Generate comprehensive coverage report
const generateCoverageReport = () => {
  return {
    statements: 95.2,
    branches: 87.3,
    functions: 98.1,
    lines: 94.8,
    uncoveredLines: [45, 67, 123]
  };
};
```

### 2. Test Metrics Dashboard
```javascript
const testMetrics = {
  totalTests: 247,
  passed: 243,
  failed: 4,
  skipped: 0,
  executionTime: '2m 34s',
  coverage: '94.8%',
  flaky: 2
};
```

## Bug Tracking & Reporting

### Bug Report Template
```markdown
## Bug Report

**Test Case:** Room Allocation - Large Class Split
**Severity:** High
**Status:** Open

**Description:**
Algorithm fails to allocate adjacent rooms for classes > 100 students

**Steps to Reproduce:**
1. Input subject with 120 students
2. Run allocation algorithm
3. Check room assignment

**Expected Result:**
Adjacent rooms should be allocated

**Actual Result:**
Rooms allocated on different floors

**Fix Suggestion:**
Modify adjacency logic in allocateRooms function
```

## Integration dengan Development Workflow

### 1. Cursor Integration
```
"Sebagai Testing Agent, saya akan:
- Review kode baru dan generate test cases
- Identify potential edge cases
- Suggest test improvements
- Validate bug fixes dengan automated tests"
```

### 2. GitHub Integration
- Automated test runs pada setiap PR
- Test status checks
- Coverage reports pada PR comments
- Automated bug issue creation

### 3. aaPanel Integration
- Production monitoring tests
- Health check endpoints
- Performance monitoring
- Error tracking dan alerting

## Testing Agent Commands

### Quick Test Commands
```bash
# Run specific test suite
npm run test:allocation
npm run test:api
npm run test:ui

# Debug specific test
npm run test:debug -- --testNamePattern="allocation"

# Generate test data
npm run generate:testdata

# Clean test environment
npm run test:clean
```

### Advanced Testing
```bash
# Load testing
npm run test:load 1000users

# Security testing
npm run test:security

# Compatibility testing
npm run test:browsers

# Mobile responsive testing
npm run test:mobile
```

---

## Usage Instructions

1. **Setup Testing Environment**
   ```bash
   npm install --save-dev jest supertest cypress
   npm run test:setup
   ```

2. **Run Testing Agent**
   ```bash
   npm run test:agent
   ```

3. **Generate Test Report**
   ```bash
   npm run test:report
   ```

4. **Monitor Continuous Testing**
   ```bash
   npm run test:monitor
   ```

5. **Run React Native App**
   ```bash
   npx react-native init examSchedulerStudent
   cd examSchedulerStudent
   ```

6. **Run React Native App**
   ```bash
   npx react-native run-android
   ``` 