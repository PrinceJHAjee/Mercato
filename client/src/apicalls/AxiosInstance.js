import axios from 'axios';
export const axiosInstance =axios.create({ 
    
    //making this global axios Instance object  so tha it call be use for all end points
    baseURL: 'http://localhost:5000',
    headers: {
          authorization: `Bearer ${localStorage.getItem('token')}` //std way to send auth token to backend
    }
  })
