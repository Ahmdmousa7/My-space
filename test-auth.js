// Quick diagnostic test for Firebase Authentication
// Run this in the browser console to check auth status

import { auth } from './services/firebase';
import { signInAnonymously } from 'firebase/auth';

console.log('=== Firebase Auth Diagnostic ===');
console.log('Auth instance:', auth);
console.log('Current user:', auth.currentUser);

// Try to sign in
signInAnonymously(auth)
    .then((userCredential) => {
        console.log('✅ Anonymous sign-in successful!');
        console.log('User ID:', userCredential.user.uid);
        console.log('User:', userCredential.user);
    })
    .catch((error) => {
        console.error('❌ Anonymous sign-in failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);

        if (error.code === 'auth/operation-not-allowed') {
            console.error('👉 SOLUTION: You need to enable Anonymous Authentication in Firebase Console!');
            console.error('   Go to: https://console.firebase.google.com/');
            console.error('   Build → Authentication → Sign-in method → Enable Anonymous');
        }
    });
