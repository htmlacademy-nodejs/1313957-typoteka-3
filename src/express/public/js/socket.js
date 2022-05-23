'use strict';

(() => {
  const COUNT_COMMENT_ELEMENT = 4;
  const MAX_COMMENT_LENGTH = 100;

  const socket = io(window.location.origin);

  const createCommentElement = (comment) => {
    const lastCommentTemplate = document.querySelector('#comments-last-template');
    const lastCommentElement = lastCommentTemplate.cloneNode(true).content;

    const avatar = lastCommentElement.querySelector(`.last__list-image`)
    if (comment['users.avatar']) {
      avatar.src = `img/${comment['users.avatar']}`;
    } else {
      avatar.src = `img/icons/smile.svg`
    }

    lastCommentElement.querySelector(`.last__list-name`)
      .innerText = `${comment['users.name']} ${comment['users.surname']}`;

    const link = lastCommentElement.querySelector(`.last__list-link`);
    link.href = `/articles/${comment['articles.id']}`;
    truncateText(link, comment.text, MAX_COMMENT_LENGTH);

    return lastCommentElement;
  };

  const updateHotElements = (hotItems) => {
    const hotList = document.querySelector('.hot__list');
    hotList.innerHTML = ``;
    hotItems.forEach((item) => {
      hotList.append(createHotElement(item));
    })
  };

  const createHotElement = (item) => {
    const hotTemplate = document.querySelector('#hot-article-template');
    const hotElement = hotTemplate.cloneNode(true).content;

    const hotListLink = hotElement.querySelector('.hot__list-link');
    hotListLink.href = `articles/${item.id}`;
    truncateText(hotListLink, item.announce, MAX_COMMENT_LENGTH);
    const sup = document.createElement(`sup`);
    sup.classList.add(`hot__link-sup`);
    sup.innerText = item[`commentsCount`]
    hotListLink.append(sup);

    return hotElement;
  };

  const updateLastComments = (comment) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    const lastCommentsItems = lastCommentsList.querySelectorAll(`.last__list-item`);

    if (lastCommentsItems.length === COUNT_COMMENT_ELEMENT) {
      lastCommentsItems[COUNT_COMMENT_ELEMENT - 1].remove();
    }
    lastCommentsList.prepend(createCommentElement(comment));
  };

  const updateDeleteComments = (comments) => {
    const lastCommentsList = document.querySelector(`.last__list`);
    lastCommentsList.innerHTML = ``;
    comments.forEach((comment) => {
      lastCommentsList.append(createCommentElement(comment));
    })
  };

  const truncateText = (el, text, n) => {
    if (text.length > n) {
      text = text.slice(0, MAX_COMMENT_LENGTH);
      text = text.slice(0, text.lastIndexOf(` `));
      el.innerText = text;
      el.innerHTML += `&nbsp;...`
    } else {
      el.innerText = text;
    }
  };

  socket.addEventListener('comment:create', (comment, populars) => {
    updateLastComments(comment);
    updateHotElements(populars);
  })

  socket.addEventListener('comment:delete', (comments, populars) => {
    updateDeleteComments(comments)
    updateHotElements(populars);
  })
})();
