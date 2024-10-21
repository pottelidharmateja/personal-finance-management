import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState('home');
  const navigate = useNavigate();
  const nodeRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // Redirect to dashboard if token exists
    }
  }, [navigate]);

  const backgroundStyles = {
    home: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${process.env.PUBLIC_URL}/images/v991-n-26.jpg)`,
    signup: 'black',
    login: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${process.env.PUBLIC_URL}/images/login-bg.jpg)`,
  };

  const homeStyle = {
    backgroundImage: backgroundStyles[currentSlide],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    color: 'white',
    transition: 'background 0.5s ease-in-out',
  };

  const handleTransition = (slide) => {
    setCurrentSlide(slide);
  };

  return (
    <div style={homeStyle}>
      <SwitchTransition>
        <CSSTransition
          key={currentSlide}
          nodeRef={nodeRef}
          classNames="fade"
          timeout={500}
        >
          <div ref={nodeRef}>
            {currentSlide === 'home' ? (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Welcome to Personal Finance Management</h1>
                <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
                  Manage your finances with ease. Get started by logging in or signing up!
                </p>
                <div className="button-group" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                  <button
                    className="home-button btn btn-success"
                    onClick={() => handleTransition('signup')}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '25px' }}
                  >
                    Signup
                  </button>
                  <button
                    className="home-button btn btn-success"
                    onClick={() => handleTransition('login')}
                    style={{ padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '25px' }}
                  >
                    Login
                  </button>
                </div>
              </div>
            ) : currentSlide === 'signup' ? (
              <Signup handleTransition={handleTransition} />
            ) : (
              <Login handleTransition={handleTransition} />
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default Home;
