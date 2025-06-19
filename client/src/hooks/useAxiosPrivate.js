//hooks/useAxiosPrivate.js
import { useEffect } from "react";
import { axiosPrivate } from "../api/axios.js";
import useAuth from './useAuth.js';
import {useNavigate } from 'react-router-dom';
import { showToast } from "../utils/toastHelper";
import baseAxios from '../api/axios'; 



const useAxiosPrivate = () => {
    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try{
                        const refreshResponse = await baseAxios.post('/auth/refresh');
                        const newAccessToken = refreshResponse.data?.accessToken;

                        setAuth(prev => ({
                            ...prev,
                            accessToken: newAccessToken,
                        }));
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    }catch(refreshError){
                        showToast('error', 'Session expired, please login again');
                        console.error('Refressh token failed', refreshError);
                        navigate('/login');
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, setAuth, navigate]);

    return axiosPrivate;
};

export default useAxiosPrivate;