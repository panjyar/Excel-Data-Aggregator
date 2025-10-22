# Backend - Excel Data Aggregator

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── config.env         # Environment variables
│   └── database.js        # Database connection setup
├── controllers/           # Business logic controllers
│   ├── dataController.js  # Data operations (CRUD, filtering)
│   └── uploadController.js # File upload processing
├── middleware/            # Custom middleware
│   └── upload.js          # File upload configuration
├── models/               # Database models
│   └── DataModel.js      # Data schema definition
├── routes/               # API routes
│   ├── data.js          # Data-related endpoints
│   └── upload.js        # Upload endpoints
├── utils/               # Utility functions
│   └── helpers.js       # Data processing helpers
├── uploads/             # Temporary file storage
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation
```bash
npm install
```

### Environment Setup
Copy `config/config.env` and update the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-aggregator
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:3000
```

### Running the Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Upload
- `POST /api/upload` - Upload Excel file

### Data
- `GET /api/data/aggregated` - Get filtered aggregated data
- `GET /api/data/filter-options` - Get available filter options
- `GET /api/data/count` - Get total record count
- `DELETE /api/data/clear` - Clear all data

## 🏗️ Architecture

### Layered Structure
1. **Routes** - Handle HTTP requests and responses
2. **Controllers** - Business logic and data processing
3. **Models** - Database schema and operations
4. **Middleware** - Request processing (upload, validation)
5. **Utils** - Helper functions and utilities
6. **Config** - Configuration and environment setup

### Key Features
- ✅ **OR Logic Filtering** - Multiple filter types work together
- ✅ **Excel Processing** - Automatic data cleaning and validation
- ✅ **Batch Processing** - Efficient large file handling
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Modular Design** - Clean separation of concerns

## 🔧 Data Processing

### Excel File Processing
1. **File Upload** - Multer middleware handles file uploads
2. **Data Extraction** - XLSX library reads Excel files
3. **Data Cleaning** - Helper functions clean problematic values
4. **Validation** - Filter out empty/invalid rows
5. **Database Storage** - Batch insert for performance

### Filtering Logic
- **OR Logic** between different filter types
- **IN Logic** for multiple values within same filter type
- **Aggregation** groups identical records and sums quantities

## 🛠️ Development

### Adding New Features
1. Create controller methods in appropriate controller
2. Add routes in route files
3. Update models if needed
4. Add utility functions if required

### Code Style
- Use async/await for database operations
- Implement proper error handling
- Follow RESTful API conventions
- Use meaningful variable names
- Add comments for complex logic

## 📝 Notes
- All temporary debugging files have been removed
- Backend is organized in a clean, layered structure
- Ready for production deployment
- Scalable and maintainable codebase
