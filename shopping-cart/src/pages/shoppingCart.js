import items from "/src/data/items.json"
import addGlobalEventListener from "/src/util/addGlobalEventListener"
import formatCurrency from "/src/util/formatCurrency"

const cartItemTemplate = document.querySelector("#cart-item-template")
const cartItemContainer = document.querySelector("[data-cart-items]")
const cart = document.querySelector("[data-cart]")
const cartItemsWrapper = document.querySelector("[data-cart-items-wrapper]")
const cartButton = document.querySelector("[data-cart-button]")
const cartQuantity = document.querySelector("[data-cart-quantity]")
const cartTotal = document.querySelector("[data-cart-total]")
const CART_STORAGE_KEY = "SHOPPING_CART-cart"
const IMAGE_URL = "https://dummyimage.com/210x130/"
const CART_ITEM_LIMIT = 20
const CART_ITEM_LIMIT_MESSAGE = "Limit 20"

let shoppingCart = loadCart()

console.log("shoppingCart.js")

export default function setupShoppingCart() {
  console.log("function setupCart")

  addGlobalEventListener("click", "[data-remove-from-cart-button]", e => {
    const id = getCartItemId(e)
    removeFromCart(id)
  })

  addGlobalEventListener("click", "[data-decrease-cart-item-button]", e => {
    const id = getCartItemId(e)
    decreaseInCart(id)
  })

  addGlobalEventListener("click", "[data-increase-cart-item-button]", e => {
    const id = getCartItemId(e)
    increaseInCart(id)
  })

  cartButton.addEventListener("click", () => {
    cartItemsWrapper.classList.toggle("invisible")
  })

  renderCart()
}

function saveCart() {
  console.log("function saveCart")
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(shoppingCart))
}

function loadCart() {
  console.log("function loadCart")
  const cart = sessionStorage.getItem(CART_STORAGE_KEY)
  return JSON.parse(cart) || []
}

export function addToCart(id) {
  console.log("function addToCart")
  const existingItem = shoppingCart.find(entry => entry.id === id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    shoppingCart.push({ id: id, quantity: 1 })
  }
  renderCart()
  saveCart()
}

function removeFromCart(id) {
  console.log("function removeFromCart")
  const existingItem = shoppingCart.find(entry => entry.id === id)
  if (existingItem == null) return
  shoppingCart = shoppingCart.filter(entry => entry.id !== id)
  renderCart()
  saveCart()
}

function decreaseInCart(id) {
  console.log("function decreaseInCart")
  const item = shoppingCart.find(entry => entry.id === id)
  if (item.quantity === 1) {
    removeFromCart(id)
    return
  }
  item.quantity--
  renderCart()
  saveCart()
}

function increaseInCart(id) {
  console.log("function increaseInCart")
  const item = shoppingCart.find(entry => entry.id === parseInt(id))
  if (item.quantity < CART_ITEM_LIMIT) {
    item.quantity++
  }
  renderCart()
  saveCart()
}

function getCartItemId(e) {
  console.log("function getCartItemId")
  const cartItemId = parseInt(
    e.target.closest("[data-cart-item]").dataset.itemId
  )
  return cartItemId
}

function renderCart() {
  console.log("function renderCart")
  if (shoppingCart.length === 0) {
    hideCart()
  } else {
    showCart()
    renderCartItems()
  }
}

function hideCart() {
  console.log("function hideCart")
  cart.classList.add("invisible")
  cartItemsWrapper.classList.add("invisible")
}

function showCart() {
  console.log("function showCart")
  cart.classList.remove("invisible")
}

function renderCartItems() {
  console.log("function renderCartItems")
  cartQuantity.innerText = shoppingCart.length

  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find(i => entry.id === i.id)
    return sum + item.priceCents * entry.quantity
  }, 0)
  cartTotal.innerText = formatCurrency(totalCents / 100)

  cartItemContainer.innerHTML = ""
  shoppingCart.forEach(entry => {
    const item = items.find(i => entry.id === i.id)

    const cartItem = cartItemTemplate.content.cloneNode(true)

    const container = cartItem.querySelector("[data-cart-item]")
    container.dataset.itemId = item.id

    const name = cartItem.querySelector("[data-name]")
    name.innerText = item.name

    const quantity = cartItem.querySelector("[data-quantity]")
    quantity.value = entry.quantity

    const price = cartItem.querySelector("[data-price]")
    price.innerText = formatCurrency((item.priceCents / 100) * entry.quantity)

    const image = cartItem.querySelector("[data-image]")
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

    if (entry.quantity >= CART_ITEM_LIMIT) {
      const message = cartItem.querySelector("#message")
      message.innerText = CART_ITEM_LIMIT_MESSAGE
      message.classList.remove("invisible")
    }

    cartItemContainer.appendChild(cartItem)
  })
}
