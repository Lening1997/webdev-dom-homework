"use strict";
import { getTodos, postTodo, postReg, postAuth } from "./api.js";
import { renderTodo } from "./render.js";

const buttonElement = document.getElementById('add-button');
const nameInputElement = document.getElementById('name-input');
const commentTextareaElement = document.getElementById('comment-textarea');
const commentLoader = document.querySelector(".comment-loader");
const startLoader = document.querySelector(".start-loader");

/* */
const formAuth = document.querySelector('.form__auth');
const formReg = document.querySelector('.form__reg');
const formAdd = document.querySelector('.add-form');
const formAuthBtn = document.querySelector('.reg__btn');

formAuthBtn.addEventListener('click', () => {
  formAuth.style.display = 'none';
  formReg.style.display = 'flex';
});

// localStorage.setItem('TOKEN', '123123123');
const user = localStorage.getItem('TOKEN');

export const changeBlocks = () => {
  formAuth.style.display = "none";
  formReg.style.display = "none";
  formAdd.style.display = 'flex';
  nameInputElement.value = localStorage.getItem('NAME');
  nameInputElement.readOnly = true;
};

if (!user) {
  formAdd.style.display = 'none';

  formAuth.addEventListener('submit', (e) => {
    /* Отмена стандартного поведения */
    e.preventDefault();

    /* e.target - это наша форма */
    // const target = e.target;

    const login = formAuth.querySelector('.login').value;
    const password = formAuth.querySelector('.password').value;

    const payload = {
      login,
      password
    };

    postAuth(payload).catch((error) => {
      alert(error.message);
    });
  });

  formReg.addEventListener('submit', (e) => {
    /* Отмена стандартного поведения */
    e.preventDefault();

    /* e.target - это наша форма */
    // const target = e.target;
    const name = formReg.querySelector('.name').value;
    const login = formReg.querySelector('.login').value;
    const password = formReg.querySelector('.password').value;

    const payload = {
      name,
      login,
      password
    };

    postReg(payload).catch((error) => {
      alert(error.message);
    });
  });
} else {
  changeBlocks();
}

export let commentsPeople = [];


const getAllComments = () => {
  getTodos().then((responseData) => {

    startLoader.style.display = "none";

    commentsPeople = responseData.comments.map((comment) => {
      return {
        // Достаем имя автора
        name: comment.author.name,
        // Преобразовываем дату-строку в Date
        date: new Date(comment.date),
        text: comment.text,
        likes: comment.likes,
        // В api пока вообще нет признака лайкнутости
        // Поэтому пока добавляем заглушку
        isLiked: false,
      };
    });

    renderComments();
  })
}

const addComment = () => {
  buttonElement.disabled = true;
  commentLoader.style.display = "block";
  postTodo({
    text: commentTextareaElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"), name: nameInputElement.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")

  }).then((res) => {
    if (res.result === 'ok') {
      commentLoader.style.display = "flex";

      getAllComments();
      renderComments();
      initEventListeners();

      commentTextareaElement.value = '';
    } else {
      alert('Произошла ошибка');
    }
  })
    .catch((error) => {
      if (error.message === 'Failed to fetch') {
        alert('Интернет не работает');
      } else {
        alert(error.message);
      }
      if (error.message === "Ошибка сервера") {
        fetchPost();
      }
      console.warn(error);
    })
    .finally(() => {
      buttonElement.disabled = false;
      commentLoader.style.display = "none";
    });
}

getAllComments();

export const initEventListeners = () => {
  const likeButtons = document.querySelectorAll('.like-button');

  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();

      let index = likeButton.dataset.index;
      console.log(index);
      if (commentsPeople[index].isLiked) {
        commentsPeople[index].isLiked = false;
        commentsPeople[index].likes--;
      } else {
        commentsPeople[index].isLiked = true;
        commentsPeople[index].likes++;
      }
      renderComments();

    });
  }
  const commentPosts = document.querySelectorAll('.comment');

  for (const commentPost of commentPosts) {
    commentPost.addEventListener('click', (event) => {
      const commentHeader = commentPost.querySelector('.comment-header > div:first-child').textContent;
      const commentText = commentPost.querySelector('.comment-text').textContent;
      const replyText = `>${commentHeader}, ${commentText},`;

      commentTextareaElement.value = replyText;
    })

  }

}

initEventListeners();

const renderComments = () => {
  renderTodo()
};

buttonElement.addEventListener('click', () => {

  nameInputElement.classList.remove('error');

  commentTextareaElement.classList.remove('error');

  if (nameInputElement.value === '' && commentTextareaElement.value === '') {
    nameInputElement.classList.add('error');
    commentTextareaElement.classList.add('error');

    return;
  }

  addComment();
});

