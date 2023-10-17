export function getTodos() {
   return fetch("https://wedev-api.sky.pro/api/v1/:lening-daria/comments", {
    method: "GET",
  }).then((response) => {
    // Вернулся Promise
    if (response.status === 200) {
      console.log('Ok');
    } else if (response.status === 500) {
      throw new Error('Сервер упал')
    }

    return response.json();
})};

export function postTodo({ text, name }) {
   return fetch("https://wedev-api.sky.pro/api/v1/:lening-daria/comments", {
        method: "POST",
        body: JSON.stringify({
          name: name,
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