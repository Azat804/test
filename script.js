const drop = function (event, basket) {
  addToBasket(event, basket);
};

const addToBasket = (event, basket, itemId) => {
  const productId = itemId ? itemId : event?.dataTransfer.getData("product");
  const product = document.querySelector(`#${productId}`);
  console.log(productId);
  let countBasketProducts = basket.parentNode.children.length - 1;
  if (countBasketProducts < 3) {
    let delta = 80;
    let totalWidthProducts = 0;
    for (let i = 1; i <= countBasketProducts; i++) {
      totalWidthProducts += basket.parentNode.children[i].clientWidth;
    }
    let paddingProduct = totalWidthProducts + delta;
    console.log(basket.parentNode.children);
    let basketProduct = document.createElement("img");
    basketProduct.src = product.src;
    basketProduct.className = `main-inner__basket-product-${productId}`;
    basketProduct.style.left = `${paddingProduct}px`;
    basket.parentNode.append(basketProduct);
    product.parentNode.removeChild(product);
    if (countBasketProducts + 1 == 3) {
      let button = document.querySelector(".main-inner__button");
      button.style.display = "inline";
      basket.removeEventListener("drop", drop, true);
      basket.removeEventListener("dragover", dragover, true);
    }
  }
};
const dragover = (event) => false;

const moveElement = function (event, item, offsetX, offsetY) {
  event.preventDefault();
  let touch = event.targetTouches[0];
  item.style.position = "fixed";
  item.style.left = touch.clientX - offsetX + "px";
  item.style.top = touch.clientY - offsetY + "px";
};

const stopMoving = function (item) {
  let elemX = item.getBoundingClientRect().left;
  let elemY = item.getBoundingClientRect().top;
  let basketLeftX = basket.getBoundingClientRect().left;
  let basketRightX = basket.getBoundingClientRect().right;
  let basketTopY = basket.getBoundingClientRect().top;
  let basketBottomY = basket.getBoundingClientRect().bottom;
  addToBasket({ basket, itemId: item.id });
  if (
    elemX > basketLeftX &&
    elemX < basketRightX &&
    elemY > basketTopY &&
    elemY < basketBottomY
  ) {
    //addToBasket(event, basket);
  }
  item.removeEventListener("touchmove", moveElement);
  item.removeEventListener("touchend", stopMoving);
};
const touchStart = function (event, item) {
  let touch = event.targetTouches[0];
  let elemX = item.getBoundingClientRect().left;
  let elemY = item.getBoundingClientRect().top;
  //item.style.position = "fixed";
  //item.style.left = elemX;
  //item.style.top = elemY;
  let offsetX = touch.clientX - parseInt(elemX || 0, 10);
  let offsetY = touch.clientY - parseInt(elemY || 0, 10);

  item.addEventListener("touchmove", (e) => {
    moveElement(e, item, offsetX, offsetY);
  });
  item.addEventListener("touchend", () => {
    stopMoving(item);
  });
};

const dragDrop = () => {
  const basket = document.querySelector(".main-inner__basket-img");
  const products = document.querySelectorAll(".shop__product");
  products.forEach((item) => {
    item.ondragstart = function (event) {
      event.dataTransfer.setData("product", this.id);
    };
    item.ontouchstart = function (event) {
      touchStart(event, item);
    };
  });
  basket.ondragover = dragover;

  basket.ondrop = function (event) {
    drop(event, basket);
  };
  document.addEventListener("touchstart", function (event) {
    event.preventDefault();
  });
  document.addEventListener("touchmove", function (event) {
    event.preventDefault();
  });
};

document.addEventListener("DOMContentLoaded", dragDrop);
