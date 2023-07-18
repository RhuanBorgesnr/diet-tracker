import React from 'react';
import img from '../assets/404.svg'

const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <img src={img} alt="Imagem não encontrada" />
        <h1>Página não encontrada</h1>
        <p>A página que você está procurando não foi encontrada.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
