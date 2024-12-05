import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectAuth } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, totpRequired } = useSelector(selectAuth);

    useEffect(() => {
        if(loading) return;
        if(!isAuthenticated) navigate('/login');
        if(!dispatch || !navigate) return;
        dispatch(logout());
        navigate('/login');
    }, [navigate, dispatch,loading]);
    return (
       <></>
    )
}

export default Logout
