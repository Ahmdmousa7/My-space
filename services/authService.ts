import { auth } from './firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

let currentUser: User | null = null;
let authInitialized = false;
let authPromiseResolver: ((user: User) => void) | null = null;
let authPromiseRejecter: ((error: any) => void) | null = null;

// Promise that resolves when auth is ready
const authReadyPromise = new Promise<User>((resolve, reject) => {
    authPromiseResolver = resolve;
    authPromiseRejecter = reject;
});

// Set up auth state listener
let hasTriedSignIn = false;
onAuthStateChanged(auth, async (user) => {
    console.log('[Auth] State changed:', user ? `User ${user.uid}` : 'No user');

    if (user) {
        currentUser = user;
        authInitialized = true;
        if (authPromiseResolver) {
            authPromiseResolver(user);
            authPromiseResolver = null;
        }
    } else if (!hasTriedSignIn) {
        // No user signed in, sign in anonymously (only try once)
        hasTriedSignIn = true;
        console.log('[Auth] Attempting anonymous sign-in...');
        try {
            const userCredential = await signInAnonymously(auth);
            console.log('[Auth] Anonymous sign-in successful:', userCredential.user.uid);
            currentUser = userCredential.user;
            authInitialized = true;
            if (authPromiseResolver) {
                authPromiseResolver(userCredential.user);
                authPromiseResolver = null;
            }
        } catch (error) {
            console.error('[Auth] Error signing in anonymously:', error);
            if (authPromiseRejecter) {
                authPromiseRejecter(error);
                authPromiseRejecter = null;
            }
        }
    }
});

/**
 * Ensures the user is authenticated and returns their user ID.
 * This function will wait for authentication to complete if needed.
 */
export const ensureAuth = async (): Promise<string> => {
    if (authInitialized && currentUser) {
        console.log('[Auth] Already authenticated:', currentUser.uid);
        return currentUser.uid;
    }

    console.log('[Auth] Waiting for authentication...');
    const user = await authReadyPromise;
    console.log('[Auth] Authentication ready:', user.uid);
    return user.uid;
};

/**
 * Get the current user ID synchronously (only use after auth is initialized)
 */
export const getCurrentUserId = (): string | null => {
    return currentUser?.uid || null;
};
