// auth.js

// 1) استيراد Firebase SDK من CDN
import {
    initializeApp,
    getApp,
    getApps
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 2) إعدادات مشروعك (من Firebase)
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

// 3) تهيئة التطبيق مرة واحدة فقط
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);

// 4) تحديد الصفحة الحالية
const path = window.location.pathname.toLowerCase();
const isLoginPage = path.endsWith("login.html") || path.endsWith("/") || path.endsWith("\\");
const isAdminPage = path.endsWith("admin.html");

// 5) مراقبة حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
    if (isAdminPage && !user) {
        // لا يوجد مستخدم -> رجوع لصفحة الدخول
        window.location.href = "login.html";
    }
    if (isLoginPage && user) {
        // المستخدم مسجل دخول وفتح login -> تحويل للإدارة
        window.location.href = "admin.html";
    }
});

// ===== تسجيل مشرف جديد =====
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const msgEl = document.getElementById("regMsg");

        msgEl.textContent = "";

        if (!email || !password) {
            msgEl.textContent = "املأ البريد وكلمة المرور";
            return;
        }

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            msgEl.textContent = "تم إنشاء الحساب بنجاح";
            console.log("REGISTER OK", cred.user.uid);
        } catch (err) {
            console.log("REGISTER ERROR", err);
            msgEl.textContent = "خطأ في التسجيل: " + (err.code || err.message);
        }
    });
}

// ===== تسجيل الدخول =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errEl = document.getElementById("loginError");

        errEl.textContent = "";

        if (!email || !password) {
            errEl.textContent = "املأ بيانات الدخول";
            return;
        }

        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            console.log("LOGIN OK", cred.user.uid);
            window.location.href = "admin.html";
        } catch (err) {
            console.log("LOGIN ERROR", err);
            errEl.textContent = "بيانات الدخول غير صحيحة أو هناك خطأ في الاتصال";
        }
    });
}

// ===== تسجيل الخروج (يُستدعى من admin.html) =====
window.logout = async function () {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (err) {
        console.log("LOGOUT ERROR", err);
    }
};