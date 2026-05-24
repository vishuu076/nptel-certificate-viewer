import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CertificateViewer.css';

function CertificateViewer() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await axios.get(`/api/certificates/${id}`);
        if (res.data.success) {
          setCertificate(res.data.certificate);
        } else {
          setError('Certificate not found');
        }
      } catch (err) {
        setError('Certificate not found or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  useEffect(() => {
    document.title = certificate
      ? `Certificate - ${certificate.originalName || id}`
      : 'Certificate Viewer';
  }, [certificate, id]);

  // Loading state
  if (loading) {
    return (
      <div className="viewer-container">
        <div className="viewer-loader">
          <div className="loader-spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="viewer-container">
        <div className="viewer-error">
          <div className="error-icon">📜</div>
          <p>Certificate not found</p>
          <span className="error-sub">The certificate you are looking for does not exist or has been removed.</span>
        </div>
      </div>
    );
  }

  const isPdf = certificate.format === 'pdf';
  const fileName = certificate.originalName
    ? certificate.originalName
    : `Certificate_${id}`;

  // ===== LANDING SCREEN (before Open) =====
  if (!opened) {
    return (
      <div className="viewer-container">
        <div className="landing-content">
          {/* File type icon */}
          <div className="landing-icon">
            {isPdf ? (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#e74c3c" opacity="0.15" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="12" y="17" textAnchor="middle" fill="#e74c3c" fontSize="5" fontWeight="700" fontFamily="Inter, sans-serif">PDF</text>
              </svg>
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#4a9eff" opacity="0.15" stroke="#4a9eff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="#4a9eff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="13" r="2" stroke="#4a9eff" strokeWidth="1.5"/>
                <path d="M20 19l-3.5-3.5" stroke="#4a9eff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>

          {/* File name */}
          <p className="landing-filename">{fileName}</p>

          {/* Open button */}
          <button className="landing-open-btn" onClick={() => setOpened(true)}>
            Open
          </button>
        </div>
      </div>
    );
  }

  // ===== CERTIFICATE VIEW (after Open) =====
  return (
    <div className="viewer-container">
      {isPdf ? (
        <div className="viewer-pdf-wrap">
          <iframe
            src={certificate.imageUrl}
            className="viewer-pdf"
            title="Certificate"
          />
        </div>
      ) : (
        <div className={`viewer-image-wrap ${imageLoaded ? 'loaded' : ''}`}>
          <img
            src={certificate.imageUrl}
            alt="Certificate"
            className="viewer-image"
            onLoad={() => setImageLoaded(true)}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}

export default CertificateViewer;
