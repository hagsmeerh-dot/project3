/**
 * NOTE: This project is a static frontend demo (no backend).
 * We keep credentials/demo data in localStorage for continuity only.
 */
(function () {
  'use strict';

  function el(id) {
    return document.getElementById(id);
  }
  function val(id) {
    var e = el(id);
    return e && typeof e.value === 'string' ? e.value.trim() : '';
  }
  function readArray(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  function writeArray(key, arr) {
    try {
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      // ignore storage failures (private mode / quota)
    }
  }

  // ---------- Student ----------
  function setStudentSession(student) {
    // Keep backward-compatible keys used by existing pages
    try {
      localStorage.setItem('studentName', student.name || '');
      localStorage.setItem('studentID', student.id || '');
      localStorage.setItem('grade', student.grade || '');
      localStorage.setItem('section', student.section || '');
      localStorage.setItem('parent', student.parentPhone || '');
      localStorage.setItem('home', student.home || '');
      localStorage.setItem('gpa', student.gpa || '');
      localStorage.setItem('rate', student.rate || '');
      localStorage.setItem('fees', student.fees || '');
      localStorage.setItem('currentStudent', JSON.stringify(student));
    } catch (e) {}
  }

  window.loginStudent = function loginStudent() {
    var sid = val('sid');
    var pass = val('pass');

    if (!sid || !pass) {
      alert('الرجاء إدخال رقم الطالب وكلمة المرور');
      return;
    }

    // Prefer registered students from localStorage; fall back to demo account.
    var students = readArray('students');
    var student =
      students.find(function (s) {
        return s && s.id === sid && s.pass === pass;
      }) || null;

    if (!student && sid === '1001' && pass === '1234') {
      student = {
        id: '1001',
        pass: '1234',
        name: 'محمد أحمد',
        grade: 'ثالث ثانوي',
        section: 'ب',
        parentPhone: '777888999',
        parentName: 'ولي الأمر',
        home: 'صنعاء',
        gpa: '92%',
        rate: 'ممتاز',
        fees: '35,000 ريال',
      };
    }

    if (!student) {
      alert('رقم الطالب أو كلمة المرور غير صحيحة');
      return;
    }

    setStudentSession(student);
    window.location.href = 'student-data.html';
  };

  // Backward compatibility (old pages used onclick="login()")
  window.login = window.loginStudent;

  // ---------- Parent ----------
  window.loginParent = function loginParent() {
    var phone = val('phone');
    var pass = val('pass');

    if (!phone || !pass) {
      alert('يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }

    if (!/^[0-9]{9,12}$/.test(phone)) {
      alert('رقم الهاتف غير صحيح');
      return;
    }

    // Try explicit parent accounts first
    var parents = readArray('parents');
    var parent =
      parents.find(function (p) {
        return p && p.phone === phone && p.pass === pass;
      }) || null;

    // Otherwise allow demo parent login
    if (!parent && phone === '7777777777' && pass === '1234') {
      parent = { name: 'ولي أمر تجريبي', phone: phone, address: 'صنعاء', pass: pass };
    }

    // Or derive parent from registered students (simple fallback)
    if (!parent) {
      var students = readArray('students');
      var s = students.find(function (x) {
        return x && x.parentPhone === phone;
      });
      if (s && pass === '1234') {
        parent = { name: s.parentName || 'ولي الأمر', phone: phone, address: s.home || '', pass: pass };
      }
    }

    if (!parent) {
      alert('بيانات الدخول غير صحيحة');
      return;
    }

    try {
      localStorage.setItem('currentParent', JSON.stringify(parent));
    } catch (e) {}

    window.location.href = 'parent-data.html';
  };

  window.loadParent = function loadParent() {
    var current = null;
    try {
      current = JSON.parse(localStorage.getItem('currentParent') || 'null');
    } catch (e) {
      current = null;
    }

    if (!current) {
      // No session; send user back to login page
      window.location.href = 'parent.html';
      return;
    }

    var nameEl = el('pname');
    var phoneEl = el('pphone');
    var addrEl = el('paddress');
    if (nameEl) nameEl.textContent = current.name || '';
    if (phoneEl) phoneEl.textContent = current.phone || '';
    if (addrEl) addrEl.textContent = current.address || '';
  };

  // ---------- Registration (Admin adds student) ----------
  window.addStudent = function addStudent() {
    // Basic client-side gate: registration should be admin-only in this demo.
    try {
      if (!localStorage.getItem('adminLoggedIn')) {
        alert('هذه الصفحة مخصّصة للمدير. يرجى تسجيل الدخول أولاً.');
        window.location.href = 'admin-login.html';
        return;
      }
    } catch (e) {}

    var id = val('aid');
    var pass = val('apass');
    var name = val('aname');
    var grade = val('agrade');
    var section = val('aclass');
    var parentName = val('aparent');
    var parentPhone = val('aphone');
    var fees = val('apay');

    if (!id || !pass || !name) {
      alert('يرجى إدخال رقم الطالب وكلمة المرور واسم الطالب');
      return;
    }
    if (!/^[0-9]{3,12}$/.test(id)) {
      alert('رقم الطالب يجب أن يكون أرقاماً فقط');
      return;
    }
    if (pass.length < 4) {
      alert('كلمة المرور يجب أن تكون 4 أحرف أو أكثر');
      return;
    }
    if (parentPhone && !/^[0-9]{9,12}$/.test(parentPhone)) {
      alert('رقم هاتف ولي الأمر غير صحيح');
      return;
    }

    var students = readArray('students');
    var exists = students.some(function (s) {
      return s && s.id === id;
    });
    if (exists) {
      alert('هذا الطالب موجود مسبقاً');
      return;
    }

    var student = {
      id: id,
      pass: pass,
      name: name,
      grade: grade,
      section: section,
      parentName: parentName,
      parentPhone: parentPhone,
      fees: fees,
      // Optional fields used by student-data page
      home: '',
      gpa: '',
      rate: '',
    };

    students.push(student);
    writeArray('students', students);

    // Create/update parent account (default password for demo)
    if (parentPhone) {
      var parents = readArray('parents');
      var pExists = parents.some(function (p) {
        return p && p.phone === parentPhone;
      });
      if (!pExists) {
        parents.push({ name: parentName || 'ولي الأمر', phone: parentPhone, address: '', pass: '1234' });
        writeArray('parents', parents);
      }
    }

    alert('تمت إضافة الطالب بنجاح');
  };

  // ---------- Admin helpers (used by admin.html / admin-login.html) ----------
  window.loginAdmin = function loginAdmin() {
    var username = val('username');
    var password = val('password');
    var err = el('error-msg');

    if (!username || !password) {
      if (err) err.innerText = 'يرجى إدخال اسم المستخدم وكلمة المرور';
      return;
    }
    if (username === 'admin' && password === '1234') {
      try {
        localStorage.setItem('adminLoggedIn', '1');
      } catch (e) {}

      var loginCard = el('admin-login-card');
      var app = el('admin-app');
      if (loginCard) loginCard.hidden = true;
      if (app) app.hidden = false;
    } else {
      if (err) err.innerText = 'اسم المستخدم أو كلمة المرور خاطئة';
    }
  };

  window.loginAdminPage = function loginAdminPage() {
    var usernameEl = el('username');
    var passwordEl = el('password');
    var err = el('error-msg');
    var username = usernameEl && usernameEl.value ? usernameEl.value.trim() : '';
    var password = passwordEl && passwordEl.value ? passwordEl.value.trim() : '';

    if (!username || !password) {
      if (err) {
        err.style.color = '#c00';
        err.innerText = 'يرجى إدخال اسم المستخدم وكلمة المرور';
      }
      if (usernameEl) usernameEl.focus();
      return;
    }

    if (username === 'admin' && password === '1234') {
      try {
        localStorage.setItem('adminLoggedIn', '1');
      } catch (e) {}
      if (err) {
        err.style.color = '#080';
        err.innerText = 'تم تسجيل الدخول — سيتم التحويل...';
      }
      setTimeout(function () {
        window.location.href = 'admin.html';
      }, 500);
    } else {
      if (err) {
        err.style.color = '#c00';
        err.innerText = 'اسم المستخدم أو كلمة المرور خاطئة';
      }
      if (passwordEl) passwordEl.focus();
    }
  };

  window.logoutAdmin = function logoutAdmin() {
    try {
      localStorage.removeItem('adminLoggedIn');
    } catch (e) {}
    try {
      window.toggleNavMenu(false);
    } catch (e) {}
    setTimeout(function () {
      window.location.href = 'admin-login.html?loggedout=1';
    }, 200);
  };

  window.toggleSidebar = function toggleSidebar() {
    var sb = document.querySelector('.sidebar');
    if (!sb) return;
    sb.classList.toggle('collapsed');
    try {
      localStorage.setItem('sidebarCollapsed', sb.classList.contains('collapsed') ? '1' : '0');
    } catch (e) {}
  };

  function navMenuDocClick(e) {
    var menu = el('navMenu');
    var btn = document.querySelector('.nav-menu-toggle');
    if (!menu) return;
    if (menu.contains(e.target) || (btn && btn.contains(e.target))) return;
    window.toggleNavMenu(false);
  }
  function navMenuKeyHandler(e) {
    if (e && e.key === 'Escape') window.toggleNavMenu(false);
  }

  window.toggleNavMenu = function toggleNavMenu(forceOpen) {
    var menu = el('navMenu');
    var backdrop = el('navBackdrop');
    var btn = document.querySelector('.nav-menu-toggle');
    if (!menu) return;

    var isOpen = menu.classList.contains('open');
    var willOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;

    if (willOpen) {
      menu.classList.add('open');
      menu.removeAttribute('hidden');
      menu.setAttribute('aria-hidden', 'false');
      if (backdrop) {
        backdrop.classList.add('open');
        backdrop.removeAttribute('hidden');
      }
      if (btn) btn.setAttribute('aria-expanded', 'true');
      document.addEventListener('click', navMenuDocClick);
      document.addEventListener('keydown', navMenuKeyHandler);
    } else {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (backdrop) {
        backdrop.classList.remove('open');
        backdrop.setAttribute('hidden', '');
      }
      if (btn) btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('hidden', '');
      document.removeEventListener('click', navMenuDocClick);
      document.removeEventListener('keydown', navMenuKeyHandler);
    }
  };

  // Admin auto-gating (only relevant on admin.html)
  document.addEventListener('DOMContentLoaded', function () {
    try {
      if (!localStorage.getItem('adminLoggedIn')) {
        if (String(location.pathname || '').endsWith('admin.html')) {
          window.location.href = 'admin-login.html';
        }
        return;
      }

      var app = el('admin-app');
      if (app) app.removeAttribute('hidden');

      // Restore sidebar collapsed state
      if (localStorage.getItem('sidebarCollapsed') === '1') {
        var sb = document.querySelector('.sidebar');
        if (sb) sb.classList.add('collapsed');
      }
    } catch (e) {}
  });
})();
