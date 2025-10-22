# Excel Data Aggregator - MERN Stack Application

A full-stack web application that imports Excel (.xlsx) files into MongoDB, aggregates data using advanced filtering, and displays the results in a responsive React frontend.

## Features

- **Excel File Import**: Upload .xlsx files and automatically import data into MongoDB
- **Advanced Filtering**: Filter data by category, branch, supplier, fabric, and concept
- **Data Aggregation**: Automatically merge identical records and sum quantities
- **Responsive UI**: Modern, mobile-friendly interface
- **Real-time Updates**: Instant filtering and data updates

## Tech Stack

- **Frontend**: React 18, Vite, Axios, React Dropzone, Styled Components
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **File Processing**: Multer, XLSX
- **Database**: MongoDB with aggregation pipelines

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd googlesheetAgreegator
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-aggregator
```

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 2. Start the Backend Server
```bash
cd backend
npm start
# or for development with auto-restart
npm run dev
```

### 3. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

### 1. Upload Excel File
- Click on the upload area or drag and drop an Excel file
- Supported formats: .xlsx, .xls
- The system will automatically process and import the data

### 2. Filter Data
- Use the filter panel to select specific categories, branches, suppliers, fabrics, or concepts
- Multiple selections are supported for each filter type
- Click "Apply Filters" to update the results
- Click "Clear All" to reset all filters

### 3. View Aggregated Data
- The data table shows aggregated results based on your filters
- Identical records are automatically merged with summed quantities
- Summary statistics are displayed at the bottom

## Data Structure

The application expects Excel files with the following columns:
- `CategoryShortName` or `Category Filter` → category
- `branch` or `Branch Filter` → branch
- `SupplierAlias` or `Supplier Filter` → supplier
- `ArticleNo` → articleNo
- `Fabric` → fabric
- `Concept` → concept
- `NetSlsQty` → NetSlsQty
- `NetAmount` → Amount
- `NetSlsCostValue` → Cost

## API Endpoints

### Upload
- `POST /api/upload` - Upload and process Excel file

### Data
- `GET /api/data/aggregated` - Get aggregated data with filters
- `GET /api/data/filter-options` - Get available filter options
- `GET /api/data/count` - Get total record count
- `DELETE /api/data/clear` - Clear all data

## Aggregation Logic

The application uses MongoDB aggregation pipelines to:
1. Filter data based on selected criteria
2. Group records by identical field values
3. Sum NetSlsQty for grouped records
4. Return only the specified display fields

## Development

### Project Structure
```
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── uploads/         # Temporary file storage
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── public/          # Static files
└── README.md
```

### Key Components
- **FileUpload**: Handles Excel file upload with drag & drop
- **FilterPanel**: Multi-select filtering interface
- **DataTable**: Displays aggregated data with summary statistics

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **File Upload Issues**
   - Verify file format (.xlsx or .xls)
   - Check file size (max 10MB)

3. **Frontend Not Loading**
   - Ensure backend is running on port 5000
   - Check for CORS issues

### Development Tips

- Use `npm run dev` for backend auto-restart
- Frontend hot-reload is enabled by default
- Check browser console for API errors
- Use MongoDB Compass to inspect imported data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
