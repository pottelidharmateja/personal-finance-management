import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group'; // For transitions

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState('home'); // Tracks the current slide

  // Styling for different backgrounds
  const backgroundStyles = {
    home: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${process.env.PUBLIC_URL}/images/v991-n-26.jpg)`,
    signup: 'black', // Black background for signup slide
    login: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${process.env.PUBLIC_URL}/images/login-bg.jpg)`, // Replace with login background
  };

  const homeStyle = {
    position: 'relative',
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

  // Transition handler
  const handleTransition = (slide) => {
    setCurrentSlide(slide);
  };

  return (
    <div style={homeStyle}>
      <SwitchTransition>
        <CSSTransition
          key={currentSlide}
          classNames="fade"
          timeout={500}
        >
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
            <div style={{ textAlign: 'center', color: 'white' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Signup Page</h2>
              <Signup /> {/* Display the Signup component */}
              <button
                className="btn btn-light"
                onClick={() => handleTransition('home')}
                style={{ padding: '10px 20px', fontSize: '1rem', marginTop: '20px' }}
              >
                Back
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'white' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>Login Page</h2>
              <Login /> {/* Display the Login component */}
              <button
                className="btn btn-light"
                onClick={() => handleTransition('home')}
                style={{ padding: '10px 20px', fontSize: '1rem', marginTop: '20px' }}
              >
                Back
              </button>
            </div>
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default Home;
