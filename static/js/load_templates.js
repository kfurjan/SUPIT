$(document).ready(() => {
  $(".modal-content").load("./template.html #modal-template");

  window.location.pathname.split("/").pop() === "o_nama.html"
    ? $("#nav-load").load("./template.html #navbar-template-o-nama")
    : $("#nav-load").load("./template.html #navbar-template");
});
