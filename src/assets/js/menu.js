window.addEventListener("scroll", function () {
  var sc = window.scrollY;
  var mainNavbar = document.getElementById("main-navbar");

  if (sc > 100) {
    mainNavbar.classList.add("navbar-scroll");
  } else {
    mainNavbar.classList.remove("navbar-scroll");
  }
});
