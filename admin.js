const ADMIN_USER = 'ADMIN';
const ADMIN_PASS = 'Medha9167';

const form = document.getElementById('admin-login-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(form);
  const user = formData.get('adminUser')?.trim();
  const pass = formData.get('adminPass')?.trim();
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('medhaAdminAuth', 'true');
    window.location.href = 'admin-responses.html';
    return;
  }
  alert('Invalid admin credentials');
});
