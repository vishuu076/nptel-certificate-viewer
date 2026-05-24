import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Certificate ID is required' });
  }

  try {
    // Check if resource exists in Cloudinary
    const result = await cloudinary.api.resource(`nptel-certificates/${id}`, {
      resource_type: 'image',
    });

    return res.status(200).json({
      success: true,
      certificate: {
        id,
        imageUrl: result.secure_url,
        format: result.format,
        originalName: result.original_filename,
      },
    });
  } catch (error) {
    // Try as raw resource (PDF)
    try {
      const result = await cloudinary.api.resource(`nptel-certificates/${id}`, {
        resource_type: 'raw',
      });

      return res.status(200).json({
        success: true,
        certificate: {
          id,
          imageUrl: result.secure_url,
          format: 'pdf',
          originalName: result.original_filename,
        },
      });
    } catch {
      return res.status(404).json({ error: 'Certificate not found' });
    }
  }
}
