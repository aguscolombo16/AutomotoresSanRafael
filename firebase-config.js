// Pegá acá los datos que te da Firebase y Cloudinary (te explico dónde sacarlos).
export const firebaseConfig = {
  apiKey: "AIzaSyAMWJRddQgaXqtCYP7ecLLHJgfi3oUPf68",
  authDomain: "automotores-san-rafael.firebaseapp.com",
  projectId: "automotores-san-rafael",
  appId: "1:442517283533:web:871576bcd312a11891ff84"
};

// Cloudinary: guarda las fotos (gratis, sin tarjeta)
export const CLOUDINARY = {
  cloudName: "bdhdual7",
  uploadPreset: "autosweb"
};

// Los dos mails que pueden entrar al panel (poné los mismos en las reglas de Firebase)
export const ADMIN_EMAILS = ["aguscolombo16@gmail.com", "c85086911@gmail.com"];
