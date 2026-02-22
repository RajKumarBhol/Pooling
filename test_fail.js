const fetch = require('node:fetch');
async function test() {
  const loginRes = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'akash@g.com', password: 'akash' })
  });
  const data = await loginRes.json();
  const token = data.jwt;
  
  const histRes = await fetch('http://localhost:8080/api/users/me/history', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const histText = await histRes.text();
  console.log(histRes.status, histText);
}
test();
