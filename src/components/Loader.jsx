// src/components/Loader.jsx
import ClipLoader from 'react-spinners/ClipLoader';

export default function Loader({ message = "Cargando..." }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <ClipLoader color="#2563eb" size={60} />
            <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#555' }}>
                {message}
            </p>
        </div>
    );
}
