import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  const token =  localStorage.getItem(TokenKey);
  return token
}

export function setToken(token) {
  return localStorage.setItem(TokenKey,token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
