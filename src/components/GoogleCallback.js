// src/components/GoogleCallback.jsx
import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useContext(AuthContext);

  useEffect(() => {
    const credential = params.get('credential');
    if (credential) {
      loginWithGoogle(credential)
        .then(() => navigate('/'))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [params, loginWithGoogle, navigate]);

  return <p>Autenticando con Google…</p>;
}
