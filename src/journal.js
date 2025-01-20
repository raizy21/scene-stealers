// console.log("journal.js");

//selector
const hamburger = document.querySelector("#hamburger-menu");
const navbarMobile = document.querySelector("#navbar-mobile");
const exitHamburgerMenu = document.querySelector("#exit-hamburger-menu");

//hamburger click
hamburger.addEventListener("click", () => {
  // console.log("clicked");
  navbarMobile.classList.add(
    "w-[100%vw]",
    "h-[100vh]",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-primaryColor",
    "bg-primaryColor"
  );
  hamburger.classList.add("hidden");
  exitHamburgerMenu.classList.remove("hidden");
  exitHamburgerMenu.classList.add("block");
});

//exit click

//exitHamburgerMenu click
exitHamburgerMenu.addEventListener("click", () => {
  // console.log("clicked");
  navbarMobile.classList.remove(
    "w-[100%vw]",
    "h-[100vh]",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-primaryColor",
    "bg-primaryColor",
    "block"
  );
  hamburger.classList.remove("hidden");
  exitHamburgerMenu.classList.remove("block");
  exitHamburgerMenu.classList.add("hidden");
  navbarMobile.classList.add("hidden");
});
