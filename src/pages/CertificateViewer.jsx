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
      ? `Certificate - ${certificate.certificateNumber || id}`
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
  const fileName = certificate.certificateNumber
    ? `${certificate.certificateNumber}.pdf`
    : `Certificate_${id}.pdf`;

  // ===== LANDING SCREEN (before Open) =====
  if (!opened) {
    return (
      <div className="viewer-container">
        <div className="landing-content">
          {/* File type icon — NPTEL Style */}
          <div className="landing-icon">
            <div className="nptel-pdf-box">
              <span className="nptel-pdf-text">PDF</span>
            </div>
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
