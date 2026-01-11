function login(){

    let id = document.getElementById("sid").value;
    let pass = document.getElementById("pass").value;
   
    // بيانات وهمية للاختبار
    if(id == "1001" && pass == "1234"){
   
      localStorage.setItem("studentName","محمد أحمد");
      localStorage.setItem("studentID","1001");
      localStorage.setItem("grade","ثالث ثانوي");
      localStorage.setItem("section","ب");
      localStorage.setItem("parent","777888999");
      localStorage.setItem("home","صنعاء");
     
      localStorage.setItem("gpa","92%");
      localStorage.setItem("rate","ممتاز");
      localStorage.setItem("fees","35,000 ريال");
   
      window.location = "student-data.html";
    }
   
    else{
      alert("رقم الطالب أو كلمة المرور غير صحيحة");
    }
  }
  function loginParent(){

    let phone = document.getElementById("phone").value;
    let pass = document.getElementById("pass").value;
   
    let parents = JSON.parse(localStorage.getItem("parents")) || [];
   
    let parent = parents.find(p => p.phone == phone && p.pass == pass);
   
    if(!parent){
      alert("بيانات الدخول غير صحيحة");
      return;
    }
   
    // حفظ ولي الأمر الحالي
    localStorage.setItem("currentParent", JSON.stringify(parent));
   
    // الانتقال للوحة الحساب
    window.location = "parent-dashboard.html";
   }
   function loginParent() {
    let phone = document.getElementById("phone").value.trim();
    let pass = document.getElementById("pass").value.trim();

    // التحقق من أن الحقول ليست فارغة
    if (phone === "" || pass === "") {
        alert("يرجى إدخال رقم الهاتف وكلمة المرور");
        return;
    }

    // التحقق من رقم الهاتف (مثال: 10 أرقام)
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("رقم الهاتف يجب أن يكون مكوّن من 10 أرقام");
        return;
    }

    // كلمة المرور (مثال بسيط)
    if (pass.length < 4) {
        alert("كلمة المرور يجب أن تكون 4 أحرف أو أكثر");
        return;
    }

    // تحقق بسيط — يمكنك لاحقاً ربطه بقاعدة بيانات
    if (phone === "7777777777" && pass === "1234") {
       
        window.location.href = "parent-data.html"; // صفحة بعد تسجيل الدخول
    } else {
        alert("بيانات الدخول غير صحيحة");
    }
}
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // ضع هنا اسم المستخدم وكلمة المرور الخاصة بالأدمن
  if(username === "admin" && password === "1234") {
    // إذا تسجيل الدخول صحيح، يتم التحويل لصفحة التسجيل
    window.location.href = "registration.html"; 
  } else {
    document.getElementById('error-msg').innerText = "اسم المستخدم أو كلمة المرور خاطئة";
  }
}
function login() {
    const sid = document.getElementById("sid").value;
    const pass = document.getElementById("pass").value;

    if (sid === "" || pass === "") {
        alert("الرجاء إدخال رقم الطالب وكلمة المرور");
        return;
    }

    // مثال بيانات تجريبية
    if (sid === "1001" && pass === "1234") {
        window.location.href = "student-data.html";
    } else {
        alert("رقم الطالب أو كلمة المرور غير صحيحة");
    }
}

// Admin login: show sidebar/dashboard only after successful admin credentials
function loginAdmin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const err = document.getElementById('error-msg');
  if (!username || !password) { if(err) err.innerText = 'يرجى إدخال اسم المستخدم وكلمة المرور'; return; }
  if (username === 'admin' && password === '1234') {
    try { localStorage.setItem('adminLoggedIn','1'); } catch(e) {}
    var loginCard = document.getElementById('admin-login-card');
    var app = document.getElementById('admin-app');
    if (loginCard) loginCard.hidden = true;
    if (app) { app.hidden = false; document.querySelector('.sidebar-nav a.dashboard-link')?.focus(); }
  } else {
    if(err) err.innerText = 'اسم المستخدم أو كلمة المرور خاطئة';
  }
}

// Login from standalone admin login page (admin-login.html)
function loginAdminPage() {
  var usernameEl = document.getElementById('username');
  var passwordEl = document.getElementById('password');
  var err = document.getElementById('error-msg');
  var username = usernameEl?.value.trim() || '';
  var password = passwordEl?.value.trim() || '';

  if (!username || !password) {
    if (err) { err.style.color = '#c00'; err.innerText = 'يرجى إدخال اسم المستخدم وكلمة المرور'; }
    usernameEl?.focus();
    return;
  }

  // Demo credentials
  if (username === 'admin' && password === '1234') {
    try { localStorage.setItem('adminLoggedIn','1'); } catch(e) {}
    if (err) { err.style.color = '#080'; err.innerText = 'تم تسجيل الدخول — سيتم التحويل...'; }
    setTimeout(function(){ window.location.href = 'admin.html'; }, 700);
  } else {
    if (err) { err.style.color = '#c00'; err.innerText = 'اسم المستخدم أو كلمة المرور خاطئة'; }
    passwordEl?.focus();
  }
}

function logoutAdmin() {
  try { localStorage.removeItem('adminLoggedIn'); console.log('logoutAdmin: cleared adminLoggedIn'); } catch(e) { console.warn('logoutAdmin: storage error', e); }
  // Close nav menu/backdrop if open
  try { toggleNavMenu(false); } catch(e) {}
  // show inline message and redirect (with fallback param)
  try {
    var msg = document.getElementById('adminMsg'); if (msg) msg.innerText = 'تم تسجيل الخروج، جارٍ التحويل...';
  } catch(e) {}
  // give user a moment to see message, then redirect to login with loggedout flag
  setTimeout(function(){ try { window.location.href = 'admin-login.html?loggedout=1'; } catch(e){ console.warn('logout redirect failed', e); } }, 300);
}

// Toggle sidebar collapsed state and persist in localStorage
function toggleSidebar() {
  var sb = document.querySelector('.sidebar');
  if (!sb) return;
  sb.classList.toggle('collapsed');
  try { localStorage.setItem('sidebarCollapsed', sb.classList.contains('collapsed') ? '1' : '0'); } catch(e) {}
}

// Toggle nav menu (appears from top nav) and add keyboard/outside-close behavior
function toggleNavMenu(forceOpen) {
  var menu = document.getElementById('navMenu');
  var backdrop = document.getElementById('navBackdrop');
  var btn = document.querySelector('.nav-menu-toggle');
  if (!menu) return;
  var isOpen = menu.classList.contains('open');
  var willOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;
  if (willOpen) {
    menu.classList.add('open'); menu.removeAttribute('hidden'); menu.setAttribute('aria-hidden','false');
    if (backdrop) { backdrop.classList.add('open'); backdrop.removeAttribute('hidden'); }
    if (btn) btn.setAttribute('aria-expanded','true');
    setTimeout(function(){ document.querySelector('#navMenu .nav-menu-close')?.focus(); }, 120);
    document.addEventListener('click', navMenuDocClick);
    document.addEventListener('keydown', navMenuKeyHandler);
  } else {
    menu.classList.remove('open'); menu.setAttribute('aria-hidden','true');
    if (backdrop) { backdrop.classList.remove('open'); backdrop.setAttribute('hidden',''); }
    if (btn) btn.setAttribute('aria-expanded','false');
    setTimeout(function(){ menu.setAttribute('hidden',''); }, 260);
    document.removeEventListener('click', navMenuDocClick);
    document.removeEventListener('keydown', navMenuKeyHandler);
  }
}
function navMenuDocClick(e) {
  var menu = document.getElementById('navMenu');
  var btn = document.querySelector('.nav-menu-toggle');
  if (!menu) return;
  if (menu.contains(e.target) || (btn && btn.contains(e.target))) return;
  toggleNavMenu(false);
}
function navMenuKeyHandler(e) { if (e.key === 'Escape') toggleNavMenu(false); }

// On load: redirect to login if not logged in, otherwise show admin app
document.addEventListener('DOMContentLoaded', function(){
  try {
    if (!localStorage.getItem('adminLoggedIn')) {
      // Not logged in -> send to login page
      if (location.pathname.endsWith('admin.html')) {
        window.location.href = 'admin-login.html';
      }
      return;
    }
    // logged in -> show admin app
    document.getElementById('admin-app')?.removeAttribute('hidden');
    document.getElementById('admin-login-card')?.setAttribute('hidden','');

    // Restore sidebar collapsed state
    var collapsed = localStorage.getItem('sidebarCollapsed');
    if (collapsed === '1') document.querySelector('.sidebar')?.classList.add('collapsed');

    // attach delegated click listener for logout as fallback
    document.addEventListener('click', function(e){
      var t = e.target || e.srcElement;
      if (t && (t.id === 'logoutBtn' || (t.closest && t.closest('#logoutBtn')))) {
        console.log('delegated click: logoutBtn detected');
        e.preventDefault();
        // Clear session and navigate explicitly as a robust fallback
        try { localStorage.removeItem('adminLoggedIn'); } catch(e) {}
        try { toggleNavMenu(false); } catch(e) {}
        // show message if area available
        try { var msg = document.getElementById('adminMsg'); if (msg) msg.innerText = 'تم تسجيل الخروج، جارٍ التحويل...'; } catch(e) {}
        // Force navigation using assign (keeps history) and replace as fallback
        try { window.location.assign('admin-login.html?loggedout=1'); } catch(e) { try { window.location.href = 'admin-login.html?loggedout=1'; } catch(e) {} }
      }
    });

    // Also attach direct click handler to the logout button to ensure it always works
    var lb = document.getElementById('logoutBtn');
    if (lb) {
      lb.addEventListener('click', function(ev){
        console.log('logoutBtn direct listener');
        ev.preventDefault();
        try { localStorage.removeItem('adminLoggedIn'); } catch(e) {}
        try { toggleNavMenu(false); } catch(e) {}
        try { var msg = document.getElementById('adminMsg'); if (msg) msg.innerText = 'تم تسجيل الخروج، جارٍ التحويل...'; } catch(e) {}
        setTimeout(function(){ try { window.location.href = 'admin-login.html?loggedout=1'; } catch(e) { console.warn('direct logout redirect failed', e); } }, 60);
      });
    }

  } catch(e) {}
});
