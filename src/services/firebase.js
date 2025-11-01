import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCW_EsREOJhLkW9P3UWHIzWVP729jrPpEQ",
  authDomain: "ja-joguei.firebaseapp.com",
  projectId: "ja-joguei",
  storageBucket: "ja-joguei.firebasestorage.app",
  messagingSenderId: "1032436127235",
  appId: "1:1032436127235:web:c8b1431fb91987d044a036"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ==================== AUTENTICAÇÃO ====================

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
  } catch (error) {
    console.error('Erro no login com Google:', error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || result.user.email.split('@')[0]
    };
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export const registerWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: displayName || result.user.email.split('@')[0]
    };
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
};

// ==================== JOGOS ====================

export const addGame = async (userId, gameData) => {
  try {
    const gamesRef = collection(db, 'users', userId, 'games');
    const docRef = await addDoc(gamesRef, {
      ...gameData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...gameData };
  } catch (error) {
    console.error('Erro ao adicionar jogo:', error);
    throw error;
  }
};

export const updateGame = async (userId, gameId, gameData) => {
  try {
    const gameRef = doc(db, 'users', userId, 'games', gameId);
    await updateDoc(gameRef, gameData);
    return { id: gameId, ...gameData };
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    throw error;
  }
};

export const deleteGame = async (userId, gameId) => {
  try {
    const gameRef = doc(db, 'users', userId, 'games', gameId);
    await deleteDoc(gameRef);
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    throw error;
  }
};

export const getGames = async (userId) => {
  try {
    const gamesRef = collection(db, 'users', userId, 'games');
    const q = query(gamesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });
    
    return games;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    throw error;
  }
};