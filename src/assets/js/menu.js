window.addEventListener("scroll", function () {
  var sc = window.scrollY;
  var mainNavbar = document.getElementById("main-navbar");
  var loggedUserMenu = document.getElementById("user-menu");

  if (sc > 60) {
    mainNavbar.classList.add("navbar-scroll"); // navbar
    loggedUserMenu.classList.add("menu-scrolled"); // menu user logged
  } else {
    mainNavbar.classList.remove("navbar-scroll");
    loggedUserMenu.classList.remove("menu-scrolled");
  }
});
