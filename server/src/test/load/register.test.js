const http = require('k6/http');
const { check } = require('k6');

// 🔥 Increase load
exports.options = {
  vus: 50,          // 👈 10 se 50 (real test)
  duration: '10s',
};

function generateUser() {
  return {
    fullName: {
      firstName: "test",
      lastName: "user"
    },
    email: `user${Math.random()}@mail.com`,
    password: "Test1234", // ✅ valid password
    city: "Ahmedabad"
  };
}

exports.default = function () {

  const user = generateUser();

  const payload = JSON.stringify(user);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    'http://localhost:3000/api/auth/register',
    payload,
    params
  );

  check(res, {
    'status is 201 or 409': (r) => r.status === 201 || r.status === 409,
  });

  // ❌ sleep हटाया → more real load
};