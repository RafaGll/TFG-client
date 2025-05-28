import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useContext(AuthContext);

  useEffect(() => {
    const token = params.get('credential');
    if (token) {
      loginWithGoogle(token)
        .then(() => navigate('/'))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [params, loginWithGoogle, navigate]);

  return <p>Autenticando con Google…</p>;
}
