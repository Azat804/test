import { selectors } from "./selectors.js";

const drop = (event, basket) => {
  addToBasket({ basket, event });
};

const addToBasket = ({ basket, event = null, itemId = "" }) => {
  const basketProductPreffix = "main-inner__basket-product-";
  const maxNumBasketProducts = 3;
  const delta = 80;
  let totalWidthProducts = 0;
  const productId = itemId ? itemId : event?.dataTransfer.getData("product");
  const product = document.querySelector(`#${productId}`);
  let countBasketProducts = basket.parentNode.children.length - 1;
  if (countBasketProducts < maxNumBasketProducts) {
    for (let i = 1; i <= countBasketProducts; i++) {
      totalWidthProducts += basket.parentNode.children[i].clientWidth;
    }
    const paddingProduct = totalWidthProducts + delta;
    const basketProduct = document.createElement("img");
    basketProduct.src = product.src;
    basketProduct.className = `${basketProductPreffix}${productId}`;
    basketProduct.style.left = `${paddingProduct}px`;
    basket.parentNode.append(basketProduct);
    product.style.opacity = 0;
    setTimeout(() => {
      product.parentNode.removeChild(product);
    }, 1000);
    if (countBasketProducts + 1 == maxNumBasketProducts) {
      let button = document.querySelector(selectors.button);
      button.style.display = "inline";
      basket.ondrop = "";
      basket.ondragover = "";
    }
  }
};

const dragOver = () => false;

const moveElement = (event, item, offsetX, offsetY) => {
  event.preventDefault();
  let touch = event.targetTouches[0];
  item.style.position = "fixed";
  item.style.left = touch.clientX - offsetX + "px";
  item.style.top = touch.clientY - offsetY + "px";
};

const stopMoving = (item, basket) => {
  const elemX = item.getBoundingClientRect().left;
  const elemY = item.getBoundingClientRect().top;
  const basketLeftX = basket.getBoundingClientRect().left;
  const basketRightX = basket.getBoundingClientRect().right;
  const basketTopY = basket.getBoundingClientRect().top;
  const basketBottomY = basket.getBoundingClientRect().bottom;
  if (
    elemX > basketLeftX &&
    elemX < basketRightX &&
    elemY > basketTopY &&
    elemY < basketBottomY
  ) {
    addToBasket({ basket, itemId: item.id });
  }
  item.removeEventListener("touchmove", moveElement);
  item.removeEventListener("touchend", stopMoving);
};
const touchStart = (event, item, basket) => {
  let touch = event.targetTouches[0];
  let elemX = item.getBoundingClientRect().left;
  let elemY = item.getBoundingClientRect().top;
  let offsetX = touch.clientX - parseInt(elemX || 0, 10);
  let offsetY = touch.clientY - parseInt(elemY || 0, 10);

  item.addEventListener("touchmove", (e) => {
    moveElement(e, item, offsetX, offsetY);
  });
  item.addEventListener("touchend", () => {
    stopMoving(item, basket);
  });
};

const dragDrop = () => {
  const basket = document.querySelector(selectors.basket);
  const products = document.querySelectorAll(selectors.shopProduct);
  products.forEach((item) => {
    item.ondragstart = function (event) {
      event.dataTransfer.setData("product", this.id);
    };
    item.ontouchstart = (event) => {
      touchStart(event, item, basket);
    };
  });
  basket.ondragover = dragOver;

  basket.ondrop = (event) => {
    drop(event, basket);
  };
  document.addEventListener("touchstart", (event) => {
    event.preventDefault();
  });
  document.addEventListener("touchmove", (event) => {
    event.preventDefault();
  });
};

document.addEventListener("DOMContentLoaded", dragDrop);
