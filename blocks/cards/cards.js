import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  /* ================ Leadership Block ================ */
  /* HELPER */
  function removeActiveClassFromArr(arr, className) {
    [...arr].forEach((carouselItem) => {
      carouselItem.classList.remove(className);
    });
  }

  function removeClassFromElement(element, className) {
    element.classList.remove(className);
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }

  function getTextFromArrTag(arr, tag, ind = null) {
    return arr[ind].querySelector(tag).textContent;
  }
  /* HELPER */

  function createLeadershipModalHTML() {
    const modal = document.createElement('div');
    const modalWrapper = document.createElement('div');
    const modalHeader = document.createElement('div');
    const modalBody = document.createElement('div');
    const modalFooter = document.createElement('div');
    const modalOverlay = document.createElement('div');
    const closeIcon = document.createElement('button');

    closeIcon.innerHTML = '&times;';

    modal.classList.add('leadership-modal');
    modalWrapper.classList.add('leadership-modal-wrapper');
    modalHeader.classList.add('leadership-modal-header');
    modalBody.classList.add('leadership-modal-body');
    modalFooter.classList.add('leadership-modal-footer');
    modalOverlay.classList.add('leadership-modal-overlay');
    closeIcon.classList.add('leadership-modal-close');

    modal.appendChild(closeIcon);
    modal.appendChild(modalWrapper);
    modalWrapper.appendChild(modalHeader);
    modalWrapper.appendChild(modalBody);
    modalWrapper.appendChild(modalFooter);
    document.body.appendChild(modal);
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener('click', removeClassFromElement.bind(null, modal, 'show'), false);
    modalOverlay.addEventListener('click', removeClassFromElement.bind(null, modalOverlay, 'show'), false);

    closeIcon.addEventListener('click', removeClassFromElement.bind(null, modal, 'show'), false);
    closeIcon.addEventListener('click', removeClassFromElement.bind(null, modalOverlay, 'show'), false);
  }
  createLeadershipModalHTML();

  function createModalCarousel(leaderCardItems, modalFooterContent) {
    const modal = document.querySelector('.leadership-modal');
    const modalBody = modal.querySelector('.leadership-modal-body');
    const modalFooter = modal.querySelector('.leadership-modal-footer');

    let prevText;
    let nextText;
    const startPoint = 0;
    const endPoint = Number(leaderCardItems.length - 1);

    leaderCardItems.forEach((leaderCard, index) => {
      const cardContent = document.createElement('div');
      const cardWrapper = document.createElement('div');

      if (index === startPoint) {
        prevText = getTextFromArrTag(leaderCardItems, 'h2', endPoint);
        nextText = getTextFromArrTag(leaderCardItems, 'h2', index + 1);
      } else if (index === endPoint) {
        prevText = getTextFromArrTag(leaderCardItems, 'h2', index - 1);
        nextText = getTextFromArrTag(leaderCardItems, 'h2', startPoint);
      } else {
        prevText = getTextFromArrTag(leaderCardItems, 'h2', index - 1);
        nextText = getTextFromArrTag(leaderCardItems, 'h2', index + 1);
      }

      cardContent.classList.add('leadership-modal-carousel-content');
      cardWrapper.classList.add('leadership-modal-carousel-item');

      cardContent.innerHTML = leaderCard.innerHTML;
      cardWrapper.innerHTML += `
      <div class="leadership-modal-pagination">
      <div class="prev-item">
        <a href="javascript:void(0)"><i class="fa fa-arrow-circle-left"></i> <span>${prevText}</span></a>
      </div>
      <div class="next-item">
        <a href="javascript:void(0)"><span>${nextText}</span> <i class="fa fa-arrow-circle-right"></i></a>
      </div>
    </div>
      `;
      cardWrapper.id = index;

      cardWrapper.appendChild(cardContent);
      modalBody.appendChild(cardWrapper);
    });
    modalFooter.innerHTML = modalFooterContent;
  }

  function showModalCard(index) {
    const modal = document.querySelector('.leadership-modal');
    const modalOverlay = document.querySelector('.leadership-modal-overlay');

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '17px';
    modal.classList.add('show');
    modalOverlay.classList.add('show');
    document.getElementById(index).classList.add('active');
  }

  const leaderCardItems = document.querySelectorAll('.leaders ul li');
  const modalCarouselItems = document.querySelector('.leadership-modal-body').children;
  const itemsLength = Number(leaderCardItems.length - 1);
  const modalFooterContent = `
    <div class="leadership-modal-carousel-nav">
      <div class="prev-item">
        <a href="javascript:void(0)"><i class="fa fa-chevron-circle-left"></i></a>
      </div>
      <div class="next-item">
        <a href="javascript:void(0)"><i class="fa fa-chevron-circle-right"></i></a>
      </div>
    </div>
    `;

  createModalCarousel(leaderCardItems, modalFooterContent);

  leaderCardItems.forEach((leaderCard, index) => {
    leaderCard.onclick = () => {
      removeActiveClassFromArr(modalCarouselItems, 'active');
      showModalCard(index);
    };
  });

  function prevCarouselHandler() {
    const activeID = Number(
      this.parentElement.parentElement.parentElement.previousElementSibling.querySelector(
        '.active',
      ).id,
    );
    removeActiveClassFromArr(modalCarouselItems, 'active');

    if (activeID === 0) {
      document.getElementById(itemsLength).classList.add('active');
    } else {
      document.getElementById(activeID - 1).classList.add('active');
    }
  }

  function nextCarouselHandler() {
    console.log(this.closest('.leadership-modal-wrapper').querySelector('.active').id);
    const activeID = Number(
      this.parentElement.parentElement.parentElement.previousElementSibling.querySelector(
        '.active',
      ).id,
    );
    removeActiveClassFromArr(modalCarouselItems, 'active');

    if (activeID === itemsLength) {
      document.getElementById(0).classList.add('active');
    } else {
      document.getElementById(activeID + 1).classList.add('active');
    }
  }

  document
    .querySelector('.leadership-modal-carousel-nav .prev-item > a')
    .addEventListener('click', prevCarouselHandler, false);
  document
    .querySelector('.leadership-modal-carousel-nav .next-item > a')
    .addEventListener('click', nextCarouselHandler, false);

  /* ================ Leadership Block ================ */
}
