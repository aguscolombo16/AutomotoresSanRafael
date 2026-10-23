import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

(async () => {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("PEGAR")) return; // todavía sin configurar
  try {
    const db = getFirestore(initializeApp(firebaseConfig));
    const snap = await getDocs(collection(db, "vehicles"));
    window.addRemoteCars(snap.docs.map(d => d.data()));
  } catch (e) {
    console.warn("No se pudieron leer los vehículos del panel:", e);
  }
})();
