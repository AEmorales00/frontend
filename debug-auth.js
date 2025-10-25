// Ejecuta esto en la consola del navegador para diagnosticar el problema de roles

console.log('=== AUTH DEBUG ===');

// 1. Check localStorage
console.log('\n1. LocalStorage keys:');
console.log('- token:', localStorage.getItem('token'));
console.log('- tec-auth:', localStorage.getItem('tec-auth'));
console.log('- auth_user:', localStorage.getItem('auth_user'));

// 2. Parse token if exists
const token = localStorage.getItem('token');
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('\n2. Token payload:', payload);
    console.log('- Token roles:', payload.roles);
  } catch (e) {
    console.error('Error decoding token:', e);
  }
}

// 3. Parse tec-auth if exists
const tecAuth = localStorage.getItem('tec-auth');
if (tecAuth) {
  try {
    const data = JSON.parse(tecAuth);
    console.log('\n3. tec-auth data:', data);
    console.log('- tec-auth user roles:', data.user?.roles);
  } catch (e) {
    console.error('Error parsing tec-auth:', e);
  }
}

// 4. Parse auth_user if exists
const authUser = localStorage.getItem('auth_user');
if (authUser) {
  try {
    const user = JSON.parse(authUser);
    console.log('\n4. auth_user data:', user);
    console.log('- auth_user roles:', user.roles);
  } catch (e) {
    console.error('Error parsing auth_user:', e);
  }
}

console.log('\n=== END DEBUG ===');
