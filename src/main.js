// console.log("main.js");

//selector
const hamburger = document.querySelector("#hamburger-menu");
const header = document.querySelector("#header");

//hamburger click
hamburger.addEventListener("click", () => {
  // console.log("clicked");
  // document.querySelector(".navigation").classList.toggle("change");

  const navbar = document.querySelector("#navbar");

  //links
  const linkHome = document.querySelector("#linkHome");
  const linkJournal = document.querySelector("#linkJournal");
  const linkEvents = document.querySelector("#linkEvents");
  const linkRegister = document.querySelector("#linkRegister");

  if (linkHome.style.display === "none") {
    navbar.classList.add("flex-col");

    //display links
    linkHome.style.display = "block";
    linkJournal.style.display = "block";
    linkEvents.style.display = "block";
    linkRegister.style.display = "block";

    hamburger.style.display = "none";
  } else {
    navbar.classList.remove("flex-col");
    navbar.classList.add("flex-row", "items-center", "justify-center");

    //hide links
    linkHome.style.display = "none";
    linkJournal.style.display = "none";
    linkEvents.style.display = "none";
    linkRegister.style.display = "none";

    hamburger.style.display = "block";
  }
});
