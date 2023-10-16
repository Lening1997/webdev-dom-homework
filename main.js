import { getTodos, postTodo } from "./api.js";
import { renderTodo } from "./render.js";
"use strict";



const buttonElement = document.getElementById('add-button');
const listElement = document.getElementById('list');
const nameInputElement = document.getElementById('name-input');
const commentTextareaElement = document.getElementById('comment-textarea');
const commentLoader = document.querySelector(".comment-loader");
const addForm = document.querySelector(".add-form");
const startLoader = document.querySelector(".start-loader");

let commentsPeople = [];




/* map - фильтрует массив но создает новый (если хочешь его использовать нужна переменная) */
/* filter - фильтрует массив */
/* reduce - подсчитывает сумму */

const getAllComments = () => {
  /*fetch("https://wedev-api.sky.pro/api/v1/:lening-daria/comments", {
    method: "GET",
  }).then((response) => {
    // Вернулся Promise
    if (response.status === 200) {
      console.log('Ok');
    } else if (response.status === 500) {
      throw new Error('Сервер упал')
    }

    return response.json();
  })*/getTodos().then((responseData) => {
    // Вернулись данные

    // Убрали лоадер
    startLoader.style.display = "none";

    // В нашу переменную заносим объекты
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

  /*fetch("https://wedev-api.sky.pro/api/v1/:lening-daria/comments", {
    method: "POST",
    body: JSON.stringify({
      name: nameInputElement.value,
      text: commentTextareaElement.value,
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
  })*/
  postTodo({
    text: commentTextareaElement.value, nameInputElement

}).then((res) => {
      if (res.result === 'ok') {
        commentLoader.style.display = "flex";

        getAllComments();
        renderComments();
        initEventListeners();

        nameInputElement.value = '';
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
      setTimeout(() => {
        commentLoader.style.display = "none";
      }, 3000);
    });
}

getAllComments();

const initEventListeners = () => {
  const likeButtons = document.querySelectorAll('.like-button');

  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();

      let index = likeButton.dataset.index;
      if (commentsPeople[index].myLike) {
        commentsPeople[index].myLike = false;
        commentsPeople[index].likesCounter--;
      } else {
        commentsPeople[index].myLike = true;
        commentsPeople[index].likesCounter++;
      }
      renderComments();

    });
  }
  const commentPosts = document.querySelectorAll('.comment');

  /*for (const commentPost of commentPosts) {
    commentPost.addEventListener('click', (event) => {
    const commentText = commentPost.querySelector('.comment-text').textContent; 
    commentTextareaElement.value = commentText;
    })
  }*/
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
  /*const studentsHtml = commentsPeople.map((comment, index) => {
    return `<li class="comment">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.date.toLocaleDateString()} ${comment.date.toLocaleTimeString()}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
        ${comment.text}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter" >${comment.likes}</span>
        <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
      </div>
    </div>
  </li>`
  }).join('');

  listElement.innerHTML = studentsHtml;

  initEventListeners();
};*/

buttonElement.addEventListener('click', () => {

  nameInputElement.classList.remove('error');

  commentTextareaElement.classList.remove('error');

  if (nameInputElement.value === '' && commentTextareaElement.value === '') {
    nameInputElement.classList.add('error');
    commentTextareaElement.classList.add('error');

    return;
  }

  const plusZero = (str) => {
    return str < 10 ? `0${str}` : str;
  };

  let currentDate = new Date();
  let zero = (n) => {
    return n < 10 ? `0${n}` : n;
  }

  const safeHtmlName = nameInputElement.value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const safeHtmlComment = commentTextareaElement.value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  addComment();
});