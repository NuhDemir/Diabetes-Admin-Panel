// frontend/src/pages/SplashScreen.jsx
import React, { useEffect, useState } from "react";
import { CSpinner } from "@coreui/react";
import styled, { keyframes } from "styled-components";

// Animasyon tanımlamaları
const glitch = keyframes`
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-5px, 5px);
  }
  40% {
    transform: translate(-5px, -5px);
  }
  60% {
    transform: translate(5px, 5px);
  }
  80% {
    transform: translate(5px, -5px);
  }
  100% {
    transform: translate(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const blink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
`;

// Styled Components
const SplashContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f8f7f2; // Kemik beyazı arka plan
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background-color: #ff3333; // Kırmızı üst şerit
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background-color: #0066ff; // Mavi alt şerit
    z-index: 1;
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background-color: #ffffff;
  border: 5px solid #000000;
  box-shadow: 15px 15px 0px #ff3333; // Kırmızı gölge
  max-width: 90%;
  width: 600px;
  position: relative;
  transform: rotate(-1deg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: rotate(1deg) translateY(-5px);
    box-shadow: 20px 20px 0px #ff3333;
  }

  &::before {
    content: "";
    position: absolute;
    top: -15px;
    right: -15px;
    width: 50px;
    height: 50px;
    background-color: #ffcc00; // Sarı köşe aksan
    border: 3px solid #000000;
    transform: rotate(15deg);
    z-index: -1;
  }
`;

const Title = styled.h1`
  font-family: "Space Mono", monospace;
  font-size: 2.8rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  padding: 0.5rem 1rem;
  background-color: #000000;
  color: #ffffff;
  transform: rotate(-2deg);
  position: relative;
  letter-spacing: -1px;
  text-align: center;

  &::after {
    content: "Uluslararası FuAy Hastanesi";
    position: absolute;
    top: 3px;
    left: 3px;
    color: #ff3333;
    z-index: -1;
    animation: ${glitch} 5s infinite;
  }
`;

const Subtitle = styled.p`
  font-family: "Space Mono", monospace;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 1.5rem 0;
  padding: 0.5rem 1rem;
  background-color: #0066ff; // Mavi arka plan
  color: #ffffff;
  transform: rotate(1deg);
  text-align: center;
  box-shadow: 5px 5px 0px #000000;
`;

const SpinnerContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 3px dashed #000000;
  position: relative;
  animation: ${float} 3s ease-in-out infinite;

  &::before {
    content: "Yükleniyor...";
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-family: "Space Mono", monospace;
    font-weight: 700;
    font-size: 1rem;
    animation: ${blink} 1s infinite;
  }
`;

const PixelDecoration = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 0;
`;

// Ana bileşen
const SplashScreen = () => {
  const [pixels, setPixels] = useState([]);

  // Rastgele pixel dekorasyonları oluşturur
  useEffect(() => {
    const pixelColors = ["#ff3333", "#0066ff", "#ffcc00", "#00cc66", "#ff66cc"];
    const newPixels = [];

    for (let i = 0; i < 15; i++) {
      newPixels.push({
        id: i,
        color: pixelColors[Math.floor(Math.random() * pixelColors.length)],
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      });
    }

    setPixels(newPixels);
  }, []);

  return (
    <SplashContainer>
      {/* Dekoratif pikseller */}
      {pixels.map((pixel) => (
        <PixelDecoration
          key={pixel.id}
          color={pixel.color}
          top={pixel.top}
          left={pixel.left}
        />
      ))}

      <ContentBox>
        {/* Logo burada olabilir */}
        {/* <img src={hospitalLogo} alt="Uluslararası FuAy Hastanesi Logosu" style={{ width: "120px", marginBottom: "1rem" }} /> */}

        <Title>Uluslararası FuAy Hastanesi</Title>
        <Subtitle>Diyabet Analiz Paneli</Subtitle>

        <SpinnerContainer>
          <CSpinner
            color="dark"
            style={{
              width: "3rem",
              height: "3rem",
              borderWidth: "0.3rem",
            }}
          />
        </SpinnerContainer>
      </ContentBox>
    </SplashContainer>
  );
};

export default SplashScreen;
