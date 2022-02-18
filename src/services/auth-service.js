const apiUrlBase = '/wishtree-api';

export async function login(username, password) {
  const res = await fetch(`${apiUrlBase}/login`, {
    method: 'POST', body: JSON.stringify({ username, password }),
  });
  if (res.ok) {
    const resJson = await res.json();
    return { error: false, username: resJson.username };
  }
  return { error: await res.text(), errorCode: res.status };
}

export async function logout() {
  fetch(`${apiUrlBase}/logout`);
}
