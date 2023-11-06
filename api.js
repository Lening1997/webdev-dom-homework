import { changeBlocks } from "./main.js";
import _ from 'lodash';

export function getTodos() {
  return fetch("https://wedev-api.sky.pro/api/v2/:lening-daria/comments", {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`,
    },
  }).then((response) => {
    // Вернулся Promise
    if (response.status === 200) {
      console.log('Ok');
    } else if (response.status === 500) {
      throw new Error('Сервер упал')
    }

    return response.json();
  })
};

export function postTodo({ text, name }) {
  return fetch("https://wedev-api.sky.pro/api/v2/:lening-daria/comments", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`,
    },
    body: JSON.stringify({
      name: _.capitalize(name),
      text: text,
      forceError: false,
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 500) {
      throw new Error('Сервер упал')
    } else if (response.status === 400) {
      throw new Error('Имя и комментрий не должны быть короче трех символов')
    }
  })
};

export function postReg({ name, login, password }) {
  return fetch("https://wedev-api.sky.pro/api/user", {
    method: "POST",
    body: JSON.stringify({
      name: _.capitalize(name),
      login: login,
      password: password
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 500) {
      throw new Error('Сервер упал')
    } else if (response.status === 400) {
      throw new Error('Пользователь с таким логином уже существует')
    }
  }).then((res) => {
    if (res) {
      console.log(res);
      const { user } = res;
      localStorage.setItem('TOKEN', user.token);
      localStorage.setItem('NAME', user.name);
      alert("Вы зарегистрированы");

      changeBlocks();
    }
  })
};

export function postAuth({ login, password }) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login: login,
      password: password
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 500) {
      throw new Error('Сервер упал')
    } else if (response.status === 400) {
      throw new Error('Введены неверные данные')
    }
  }).then((res) => {
    if (res) {
      console.log(res);
      const { user } = res;
      localStorage.setItem('TOKEN', user.token);
      localStorage.setItem('NAME', user.name);
      alert("Вы авторизованы");

      changeBlocks();
    }
  })
};