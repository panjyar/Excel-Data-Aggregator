# Frontend Environment Configuration

Create a `.env` file in the frontend directory with the following content:

```env
# React App Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## For Production Deployment

Update the `.env` file to use your deployed backend URL:

```env
# React App Configuration
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
```

## Important Notes

- React environment variables must start with `REACT_APP_`
- The `.env` file should be in the frontend root directory
- Never commit `.env` files to version control
- Restart the development server after changing environment variables
