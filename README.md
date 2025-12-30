# Excel Uploader - Next.js Application

A modern web application that allows users to upload Excel files, automatically convert them to JSON, and submit the data to an external API.

## 🎯 Project Overview

This project provides:
- **Upload Excel Files** - Support for `.xlsx` and `.xls` formats
- **Real-time JSON Conversion** - Automatically convert Excel data to JSON
- **Backend API Integration** - Securely forward data to external APIs
- **Mock Mode Testing** - Built-in testing mode for development
- **Error Handling** - Comprehensive validation and error messages

## ✨ Features

### Frontend
- 📁 Excel file upload with validation
- 📊 Real-time JSON conversion
- ✅ File type validation
- 🎯 One-click submission
- 🔒 Safe file handling

### Backend
- 🚀 Next.js API routes
- 🔐 Environment-based configuration
- 🛡️ Error handling & logging
- 🧪 Mock mode for testing
- 📤 Data forwarding to external APIs

## 🛠️ Tech Stack

- **React 18** - Frontend
- **Next.js 16** - Backend API routes
- **XLSX** - Excel parsing
- **Node.js** - Runtime

## 📋 How It Works

```
Upload Excel → Convert JSON → Send to API → Return Response
```

**Example:**
```
Excel File:
| Name | Email |
|------|-------|
| John | john@example.com |

Becomes:
[{ "Name": "John", "Email": "john@example.com" }]
```

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📁 Structure

```
excel-project/
├── app/
│   ├── api/push-to-external/route.js
│   └── page.js
├── components/
│   └── ExcelUploader.js
├── .env.local
└── package.json
```

## ⚙️ Configuration

### Mock Mode (Default)
```
EXTERNAL_API_URL=http://localhost:3000/api/mock
```

### Real API
```
EXTERNAL_API_URL=https://your-api.com/upload
EXTERNAL_API_KEY=your_key
```

## 🧪 Test It

1. Upload Excel file
2. Click "Confirm & Submit"
3. Check terminal for data logs
4. See success message

## 🔒 Security

- File type validation
- Server-side API keys
- No direct browser-to-API calls
- Error handling

## 📚 Links

- [Next.js](https://nextjs.org/docs)
- [XLSX Library](https://docs.sheetjs.com/)
