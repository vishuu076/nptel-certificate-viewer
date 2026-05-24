Project Name
NPTEL Style Certificate Viewer
🎯 Objective
Build a lightweight certificate viewing system where:
QR code opens a webpage
The webpage directly displays the uploaded certificate image/PDF
Experience should visually feel identical to NPTEL certificate opening experience
No extra UI or dashboard should appear.
🔥 REQUIRED EXPERIENCE
When QR is scanned:
Plain text
Scan QR
   ↓
Browser Opens
   ↓
Certificate Opens Fullscreen
The experience should feel:
clean
authentic
professional
exactly like NPTEL viewer
🔥 UI REQUIREMENTS
Page Layout
The page should contain:
✅ Dark background
✅ Centered certificate
✅ Mobile-friendly fullscreen view
✅ Zoom support
✅ No unnecessary text
✅ No dashboard feel
✅ Minimal UI
🔥 DISPLAY STYLE
Certificate should:
appear centered
occupy most screen width
keep original aspect ratio
open smoothly on mobile
🔥 ROUTING STRUCTURE
Each certificate should have unique route:
Plain text
/certificates/:id
Example:
Plain text
https://domain.com/certificates/abc123
QR code should contain this URL.
🔥 WORKFLOW
Admin Side
Plain text
Upload Certificate
      ↓
Generate Public URL
      ↓
Generate QR Code
      ↓
Paste QR in Canva Certificate
User Side
Plain text
Scan QR
      ↓
Open Certificate Viewer
      ↓
See Full Certificate
🔥 TECH STACK
Frontend
React.js
Backend
Node.js + Express
Storage
Cloudinary
QR Generator
qrcode npm package
🔥 CERTIFICATE DISPLAY REQUIREMENTS
Certificate viewer page should:
✅ show only certificate
✅ mimic NPTEL opening experience
✅ support image/PDF display
✅ work smoothly on Android devices
✅ preserve certificate quality
🔥 DESIGN REFERENCE
Use the attached NPTEL screenshot as the exact UI/UX reference.
The final output should visually feel as close as possible to:
NPTEL certificate viewer
direct certificate opening experience
clean minimal layout
🚫 DO NOT ADD
❌ Login
❌ Student details panel
❌ Dashboard UI
❌ Fancy animations
❌ Database-heavy features
❌ Extra sections
Keep it minimal and authentic.
🔥 FINAL GOAL
The final experience must feel like:
Plain text
Official certificate verification opening page
where:
QR scan instantly opens certificate
certificate is displayed fullscreen
no unnecessary UI is visible
experience feels real and professional like NPTEL.