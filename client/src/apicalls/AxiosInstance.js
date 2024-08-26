import axios from 'axios';
export const axiosInstance =axios.create({ 
    
    //making this global axios Instance object  so tha it call be use for all end points
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    headers: {
          authorization: `Bearer ${localStorage.getItem('token')}` //std way to send auth token to backend
    }
  })
