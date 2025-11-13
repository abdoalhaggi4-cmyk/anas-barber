// auth.js
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAz9EtvfCQuyTTgeEcT6F1CjcpCg5JzeSA",
    authDomain: "anas-project-39b6b.firebaseapp.com",
    databaseURL: "https://anas-project-39b6b-default-rtdb.firebaseio.com",
    projectId: "anas-project-39b6b",
    storageBucket: "anas-project-39b6b.firebasestorage.app",
    messagingSenderId: "975846667862",
    appId: "1:975846667862:web:427b6ca200b21c9813edf7",
    measurementId: "G-X0NHN24EVW"
};

let app;
if (!getApps().length) app = initializeApp(firebaseConfig);
else app = getApp();

const auth = getAuth(app);

// تحديد الصفحة
const path = (window.location.pathname || "").toLowerCase();
const isLogin = path.endsWith("login.html") || path.endsWith("/") || path.endsWith("\\");
const isAdmin = path.endsWith("admin.html");

// مراقبة الحالة
onAuthStateChanged(auth, (user) => {
    if (isAdmin && !user) window.location.href = "login.html";
    if (isLogin && user) window.location.href = "admin.html";
});

// إنشاء مشرف
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const msgEl = document.getElementById("regMsg");
        msgEl.textContent = "";

        if (!email || !password) { msgEl.textContent = "املأ البريد وكلمة المرور"; return; }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            msgEl.textContent = "تم إنشاء الحساب بنجاح";
        } catch (err) {
            msgEl.textContent = "خطأ في التسجيل: " + (err.code || err.message);
        }
    });
}

// دخول بالبريد/الرمز
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errEl = document.getElementById("loginError");
        errEl.textContent = "";
        if (!email || !password) { errEl.textContent = "املأ بيانات الدخول"; return; }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "admin.html";
        } catch (err) {
            errEl.textContent = "بيانات الدخول غير صحيحة أو مشكلة اتصال";
        }
    });

    // تسجيل عبر Google
    const googleBtn = document.getElementById("googleBtn");
    if (googleBtn) {
        googleBtn.addEventListener("click", async () => {
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                window.location.href = "admin.html";
            } catch (err) {
                const errEl = document.getElementById("loginError");
                if (errEl) errEl.textContent = "تعذّر تسجيل الدخول عبر Google";
            }
        });
    }
}

// للخروج تُستدعى من admin.html
window.logout = async function () {
    try { await signOut(auth); window.location.href = "login.html"; }
    catch (err) { console.log("LOGOUT ERROR", err); }
};