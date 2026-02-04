import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
// dotenv not needed as we hardcoded keys for this test script
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Manually defining config since we are running in Node and don't want to mess with vite env loading in this simple script
// Using the values known from the chat history/previous steps
const firebaseConfig = {
    apiKey: "AIzaSyCNDxEj-vhDhkMpmNK0CvvoIMmPo2EGLDI",
    authDomain: "ahmed-mo-space.firebaseapp.com",
    projectId: "ahmed-mo-space",
    storageBucket: "ahmed-mo-space.firebasestorage.app",
    appId: "1:696776097102:web:850e0d84abd76be8e3721f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const DOC_REF = doc(db, 'workspaces', 'default');

async function runTest() {
    console.log("1. Connecting to Firestore...");

    try {
        // 1. Read current state
        const docSnap = await getDoc(DOC_REF);
        let state = docSnap.exists() ? docSnap.data() : { tasks: [] };

        console.log("2. Current Tasks Count:", state.tasks?.length || 0);

        // 2. Add a test task
        const newTask = {
            id: "test-" + Date.now(),
            title: "Automated Verifiction Task " + new Date().toLocaleTimeString(),
            completed: false,
            priority: 'high',
            createdAt: Date.now(),
            color: 'purple'
        };

        // Ensure tasks array exists
        if (!state.tasks) state.tasks = [];
        state.tasks.unshift(newTask);

        // Update timestamp
        state.lastUpdated = Date.now();

        console.log("3. Adding Task:", newTask.title);

        // 3. Save state
        await setDoc(DOC_REF, state);
        console.log("4. Saved successfully to Cloud.");

        // 4. Verify
        console.log("5. Verifying persistence...");
        const checkSnap = await getDoc(DOC_REF);
        const savedState = checkSnap.data();

        if (savedState.tasks.find(t => t.id === newTask.id)) {
            console.log("SUCCESS: Task found in database!");
            console.log("---------------------------------------------------");
            console.log("ACTION: Reload your browser now. You should see this task appear.");
        } else {
            console.error("FAILURE: Task was not found after save.");
        }

    } catch (error) {
        console.error("TEST FAILED:", error);
    }
}

runTest();
