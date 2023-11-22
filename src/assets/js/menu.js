window.addEventListener("scroll", function () {
  var sc = window.scrollY;
  const mainNavbar = document.getElementById("main-navbar");
  const loggedUserMenu = document.getElementById("user-menu");

  if (mainNavbar != null) {
    if (sc > 60) {
      mainNavbar.classList.add("navbar-scroll"); // navbar
    } else {
      mainNavbar.classList.remove("navbar-scroll");
    }

    if (mainNavbar.classList.contains("navbar-scroll")) {
      if (loggedUserMenu != null) {
        loggedUserMenu.classList.add("menu-scrolled"); // menu user logged
      }
    } else {
      if (loggedUserMenu != null) {
        loggedUserMenu.classList.remove("menu-scrolled"); // menu user logged
      }
    }
  }
});
