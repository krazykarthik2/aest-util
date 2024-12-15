import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, selectAuth } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (loading) return;
    if (!dispatch || !navigate) return;
    if (isAuthenticated) dispatch(logout());
    setTimeout(() => {
      navigate("/login");
    }, 0);
  }, [navigate, dispatch, loading]);
  return <></>;
}

export default Logout;
