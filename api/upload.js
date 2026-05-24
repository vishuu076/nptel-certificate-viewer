import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Required for formidable file parsing
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the multipart form
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const file = files.certificate?.[0];
    const certificateNumber = fields.certificateNumber?.[0]?.trim() || '';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!certificateNumber) {
      return res.status(400).json({ error: 'Certificate number is required' });
    }

    // Generate certificate ID using sanitized custom certificate number
    const certId = certificateNumber.replace(/[^a-zA-Z0-9-_]/g, '_');

    // Upload to Cloudinary
    const cloudResult = await cloudinary.uploader.upload(file.filepath, {
      folder: 'nptel-certificates',
      public_id: certId,
      resource_type: 'auto',
      quality: 'auto:best',
      fetch_format: 'auto',
      context: { certificateNumber }
    });

    // Build public URL matching NPTEL structure
    const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`;
    const publicUrl = `${baseUrl}/noc/E_Certificate/${certId}`;

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(publicUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    // Clean up temp file
    try { fs.unlinkSync(file.filepath); } catch { }

    return res.status(200).json({
      success: true,
      certificate: {
        id: certId,
        imageUrl: cloudResult.secure_url,
        publicUrl,
        qrCode: qrDataUrl,
        format: cloudResult.format,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
}
