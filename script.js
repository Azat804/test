const drop = function (event) {
  const basket = document.querySelector(".main-inner__basket-img");
  const productId = event.dataTransfer.getData("product");
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
  //event.preventDefault();
  let touch = event.targetTouches[0];
  //itemmstyle.position = "fixed";
  item.style.left = touch.clientX - offsetX + "px";
  item.style.top = touch.clientY - offsetY + "px";
};

const stopMoving = function () {
  document.removeEventListener("touchmove", moveElement);
  document.removeEventListener("touchend", stopMoving);
};
const touchStart = function (e, item) {
  let touch = e.targetTouches[0];
  let offsetX = touch.clientX - parseInt(item.left || 0, 10);
  let offsetY = touch.clientY - parseInt(item.top || 0, 10);

  document.addEventListener("touchmove", (event) => {
    // event.stopPropagation();
    //event.preventDefault();
    moveElement(event, item, offsetX, offsetY);
  });
  document.addEventListener("touchend", (event) => {
    // event.stopPropagation();
    //stopMoving();
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
      //event.stopPropagation();
      event.dataTransfer.setData("productTouch", this.id);
      touchStart(event, item);
    };
  });
  document.addEventListener("touchmove", function (event) {
    //event.stopPropagation();
    // event.preventDefault();
  });
  basket.ondragover = dragover;

  basket.ondrop = drop;
};

document.addEventListener("DOMContentLoaded", dragDrop);
