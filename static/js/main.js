/*TODO  Preload */
var preLoad = document.getElementById("loading");

function PreLoad() {
  preLoad.style.display = "none";
}

/*TODO  Force Scroll top */
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
} else {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}

/*TODO  Menu */
const navMenu = document.getElementById("nav-menu-mobile"),
  navToggle = document.getElementById("nav-toggle-mobile"),
  navClose = document.getElementById("nav-close-mobile");

/*TODO  Show */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show_menu-mobile");
  });
}

/*TODO  Close */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show_menu-mobile");
  });
}

/*TODO  Remove Menu Mobile */
const navLink = document.querySelectorAll(".nav_link-mobile");

function linkAction() {
  const navMenu = document.getElementById("nav-menu-mobile");

  navMenu.classList.remove("show_menu-mobile");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*TODO  EXPANDER MENU  ==========*/
const showMenu = (sidebarId, contentId, popupId, boxModelId) => {
  const sidebar = document.getElementById(sidebarId),
    bodypadding = document.getElementById(contentId),
    popuppadding = document.getElementById(popupId),
    boxModel = document.getElementById(boxModelId);

  if (sidebar) {
    sidebar.addEventListener("mouseover", () => {
      bodypadding.classList.add("content-gap");
      bodypadding.classList.remove("content");
      popuppadding.classList.add("popup-gap");
      boxModel.classList.add("popup-gap");
      $(".logo_img").attr("src", "/src/images/Osmocom_logo.svg");
    });
    sidebar.addEventListener("mouseout", () => {
      bodypadding.classList.add("content");
      bodypadding.classList.remove("content-gap");
      popuppadding.classList.remove("popup-gap");
      boxModel.classList.remove("popup-gap");
      $(".logo_img").attr("src", "/src/images/osmocom_icon.svg");
    });
  }
};
showMenu("sidebar", "content", "popup", "box-model");

/*===== LINK ACTIVE  =====*/
const linkColor = document.querySelectorAll(".sidebar_link");
function colorLink() {
  linkColor.forEach((l) => l.classList.remove("active"));
  this.classList.add("active");
}
linkColor.forEach((l) => l.addEventListener("click", colorLink));

/*TODO  List */
const listContent = document.querySelectorAll(".list_content"),
  listHeader = document.querySelectorAll(".list_header");

function toggleList() {
  let itemClass = this.parentNode.className;
  for (i = 0; i < listContent.length; i++) {
    listContent[i].classList.add("list_close");
    listContent[i].classList.remove("list_open");
  }
  if (itemClass === "list_content list_close") {
    this.parentNode.className = "list_content list_open";
  } else {
    this.parentNode.className = "list_content list_close";
  }
}
listHeader.forEach((el) => {
  el.addEventListener("click", toggleList);
});

/*TODO  Drop down select */
$(".custom-select").each(function () {
  var classes = $(this).attr("class"),
    value = $(this).find("option").filter(":selected").attr("value");
  var template = '<div class="' + classes + '">';
  template += '<span class="custom-select-trigger">' + value + "</span>";

  template += '<div class="custom-options">';
  $(this)
    .find("option")
    .each(function () {
      template +=
        '<span class="custom-option "data-value="' +
        $(this).attr("value") +
        '">' +
        $(this).html() +
        "</span>";
    });
  template += "</div></div>";

  $(this).wrap('<div class="custom-select-wrapper"></div>');
  $(this).hide();
  $(this).after(template);
});
$(".custom-option:first-of-type").hover(
  function () {
    $(this).parents(".custom-options").addClass("option-hover");
  },
  function () {
    $(this).parents(".custom-options").removeClass("option-hover");
  }
);
$(".custom-select-trigger").on("click", function () {
  $("html").one("click", function () {
    $(".custom-select").removeClass("opened");
  });
  $(this).parents(".custom-select").toggleClass("opened");
  event.stopPropagation();
});
$(".custom-option").on("click", function () {
  $(this)
    .parents(".custom-select-wrapper")
    .find("select")
    .val($(this).data("value"));
  $(this)
    .parents(".custom-options")
    .find(".custom-option")
    .removeClass("selection");
  $(this).addClass("selection");
  $(this).parents(".custom-select").removeClass("opened");
  $(this)
    .parents(".custom-select")
    .find(".custom-select-trigger")
    .text($(this).text());
});

/*TODO  Range slider */
const sliders = document.querySelectorAll(".slider-ui");

sliders.forEach((slider) => {
  let input = slider.querySelector("input[type=range]");
  let min = input.getAttribute("min");
  let max = input.getAttribute("max");
  let maxText = input.getAttribute("max");
  let valueElem = slider.querySelector(".value");
  let parameter = "";
  if (max >= 1000000) {
    maxText = max / 1000000;
    parameter = "M";
  } else if (max >= 1000) {
    maxText = max / 1000;
    parameter = "K";
  }
  slider.querySelector(".min").innerText = min;
  slider.querySelector(".max").innerText = maxText + parameter;

  function setValueElem() {
    if (input.value >= 10000) {
      valueElem.style = "font-size: 8px;";
    }
    valueElem.innerText = input.value;
    let percent = ((input.value - min) / (max - min)) * 100;
    valueElem.style.left = percent + "%";
  }
  setValueElem();

  input.addEventListener("input", setValueElem);
  input.addEventListener("mousedown", () => {
    valueElem.classList.add("up");
  });
  input.addEventListener("mouseup", () => {
    valueElem.classList.remove("up");
  });
});
/*TODO  Box model */
const modelViews = document.querySelector(".box_model"),
  modelContent = document.querySelectorAll(".box_model-content"),
  modelButtons = document.querySelectorAll(".box_button"),
  modelCloses = document.querySelectorAll(".box_model-close");

let model = function (modelClick) {
  modelViews.classList.add("active-model");
  modelContent[modelClick].classList.add("active-model-content");
};

modelButtons.forEach((modelButton, i) => {
  modelButton.addEventListener("click", () => {
    model(i);
  });
});

modelCloses.forEach((modelClose) => {
  modelClose.addEventListener("click", () => {
    modelViews.classList.remove("active-model");
    modelContent.forEach((Content) => {
      Content.classList.remove("active-model-content");
    });
  });
});

/*TODO  Change Background Header */
const nav = document.getElementById("header-bg");
if (window.innerWidth < 768) {
  nav.classList.remove("header_bg");
  nav.classList.add("header_bg-mobile");
} else {
  nav.classList.add("header_bg");
  if (this.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
function scrollHeader() {
  if (window.innerWidth < 768) {
    nav.classList.remove("header_bg");
    nav.classList.add("header_bg-mobile");
  } else {
    nav.classList.add("header_bg");
    if (this.scrollY >= 80) nav.classList.add("scroll-header");
    else nav.classList.remove("scroll-header");
  }
}
window.addEventListener("scroll", scrollHeader);
window.addEventListener("resize", scrollHeader);
/*TODO  Scroll Up */
function scrollTop() {
  const scrollUp = document.getElementById("scroll-up");
  if (this.scrollY >= 560) scrollUp.classList.add("show-scroll");
  else scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollTop);

/*TODO  Change Theme */
const themeButton = document.getElementById("theme-button");
const captionText = document.querySelector(".theme-name");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";
if (UserAuthenticated) {
  var selectedTheme = userTheme;
  var selectedIcon = userThemeIcon;
} else {
  var selectedTheme = localStorage.getItem("selected-theme");
  var selectedIcon = localStorage.getItem("selected-icon");
}
var selectedColor = localStorage.getItem("selected-color");
var redColor = localStorage.getItem("setRedColor");
var greenColor = localStorage.getItem("setGreenColor");
var blueColor = localStorage.getItem("setBlueColor");
var SVGColor = localStorage.getItem("svg-color");
document.querySelector(":root").style.setProperty("--hue-color", selectedColor);
document.querySelector(":root").style.setProperty("--color-svg", SVGColor);

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
  if (document.body.className === darkTheme) {
    captionText.textContent = "Light";
  } else {
    captionText.textContent = "Dark";
  }
});
if (document.body.className === darkTheme) {
  captionText.textContent = "Light";
} else {
  captionText.textContent = "Dark";
}
var background = document
  .querySelectorAll(".theme-colors .color")[0]
  .getAttribute("hue-color");
var particlecolor = document
  .querySelectorAll(".theme-colors .color")[0]
  .getAttribute("particle-color");

if (
  redColor == null ||
  greenColor == null ||
  blueColor == null ||
  SVGColor == null
) {
  var redColor = document
    .querySelectorAll(".theme-colors .color")[0]
    .getAttribute("red");
  var greenColor = document
    .querySelectorAll(".theme-colors .color")[0]
    .getAttribute("green");
  var blueColor = document
    .querySelectorAll(".theme-colors .color")[0]
    .getAttribute("blue");
  var SVGColor = document
    .querySelectorAll(".theme-colors .color")[0]
    .getAttribute("svg-color");
}

document.querySelectorAll(".theme-colors .color").forEach((color) => {
  color.onclick = () => {
    var colorName = color.getAttribute("name");
    var background = color.getAttribute("hue-color");
    var redColor = color.getAttribute("red");
    var greenColor = color.getAttribute("green");
    var blueColor = color.getAttribute("blue");
    var particlecolor = color.getAttribute("particle-color");
    var SVGColor = color.getAttribute("svg-color");
    document
      .querySelector(":root")
      .style.setProperty("--hue-color", background);
    document.querySelector(":root").style.setProperty("--color-svg", SVGColor);
    localStorage.setItem("selected-color", background);
    localStorage.setItem("particle-color", particlecolor);
    localStorage.setItem("setRedColor", redColor);
    localStorage.setItem("setGreenColor", greenColor);
    localStorage.setItem("setBlueColor", blueColor);
    localStorage.setItem("svg-color", SVGColor);
    try {
      updateGaugeColor();
    } catch (err) {
      null;
    }
    try {
      updateLineChartColor();
    } catch (err) {
      null;
    }
    try {
      updateBarChartColor();
    } catch (err) {
      null;
    }
    try {
      updateMatrixChartColor();
    } catch (err) {
      null;
    }
    try {
      document.querySelector("#theme_color").value = colorName;
    } catch (err) {
      null;
    }
  };
});

/*TODO  Change Theme Chart */

const chartStyle = getComputedStyle(document.body);
var chartColor = chartStyle.getPropertyValue("--chart-color");
var chartColorBorder = chartStyle.getPropertyValue("--chart-color-border");

/*TODO  Popup */

const popup = document.querySelector(".popup");
const pop = document.querySelectorAll(".pop");
const popupContent = document.querySelectorAll(".popup_content");

pop.forEach((preview) => {
  preview.addEventListener("click", () => {
    const idText = preview.getAttribute("name");
    for (i = 0; i < popupContent.length; i++) {
      if (popupContent[i].className === "popup_content " + idText) {
        popupContent[i].classList.add("open");
      } else {
        popupContent[i].classList.remove("open");
      }
    }
    popup.classList.add("open");
  });
});
popup.addEventListener("click", (e) => {
  if (e.target.classList.contains("popup")) {
    popup.classList.remove("open");
    for (i = 0; i < popupContent.length; i++) {
      popupContent[i].classList.remove("open");
    }
    linkColor.forEach((l) => l.classList.remove("active"));
  }
});

/*TODO  Notification */
let globalOptions = {
  position: "top-right",
  maxNotifications: 5,
  animationDuration: 200,
  durations: {
    global: 5000,
  },
  icons: {
    enabled: true,
    prefix: "<i class='uil ",
    suffix: "'></i>",
    warning: "uil-exclamation-triangle",
    success: "uil-check-circle",
    error: "uil-times-circle",
  },
};
let notifier = new AWN(globalOptions);

/*TODO  Scroll Reveal */
const revealActive = document.querySelector(".Reveal");

if (UserAuthenticated) {
  revealActive.checked = userReveal;
} else {
  if (localStorage.getItem("reveal") == "true") {
    revealActive.checked = true;
  } else {
    revealActive.checked = false;
  }
}

revealActive.addEventListener("click", () => {
  checkReveal();
});

function checkReveal() {
  if (revealActive.checked) {
    localStorage.setItem("reveal", "true");
    const sr = ScrollReveal({
      distance: "50px",
      duration: 2000,
      delay: 0,
      reset: false,
    });
    sr.reveal(`.nav_logo`, {
      origin: "left",
      interval: 50,
    });
    sr.reveal(`.section_title, .section_subtitle`, {
      interval: 50,
    });

    sr.reveal(`.list_header`, {
      interval: 50,
      distance: "100px",
    });

    sr.reveal(`.box_content`, {
      origin: "right",
      interval: 50,
      distance: "200px",
    });
    sr.reveal(`.swipe_container`, {
      origin: "left",
      interval: 50,
    });
    sr.reveal(`.lbox_container`, {
      distance: "200px",
      origin: "right",
    });
    sr.reveal(`.lbox_title`, {
      origin: "top",
    });
    sr.reveal(`.lbox_description`, {
      interval: 50,
    });
    sr.reveal(`.lbox_img-reveal`, {
      origin: "right",
    });
  } else {
    localStorage.setItem("reveal", "false");
  }
}
checkReveal();

/*TODO  particlesJS */
const particleActive = document.querySelector(".ParticlesJS");
try {
  var particleColor = localStorage.getItem("particle-color").split(",");
} catch (err) {
  var particleColor = ["#e06257", "#cb4e43", "#fcbbb6"];
}
if (UserAuthenticated) {
  particleActive.checked = userParticlejs;
} else {
  if (localStorage.getItem("particle-JS") == "true") {
    particleActive.checked = true;
  } else {
    particleActive.checked = false;
  }
}

function checkParticleJS() {
  if (document.body.className === darkTheme) {
    var lineColor = "#ffffff";
  } else {
    var lineColor = "#000000";
  }
  if (particleActive.checked) {
    localStorage.setItem("particle-JS", "true");
    particlesJS("particles-js", {
      particles: {
        number: { value: 10, density: { enable: true, value_area: 1500 } },
        color: { value: particleColor }, //FIXME: Not updateing after change color need page reflesh
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 12 },
          image: { src: "img/github.svg", width: 100, height: 100 },
        },
        opacity: {
          value: 0.03,
          random: false,
          anim: { enable: false, speed: 0.05, opacity_min: 0.01, sync: true },
        },
        size: {
          value: 500,
          random: true,
          anim: { enable: true, speed: 5, size_min: 0.1, sync: true },
        },
        line_linked: {
          enable: true,
          distance: 500,
          color: lineColor,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "bounce",
          bounce: false,
          attract: { enable: true, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false, mode: "repulse" },
          onclick: { enable: true, mode: "repulse" },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: { distance: 300, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  } else {
    localStorage.setItem("particle-JS", "false");
    particlesJS("particles-js", {
      particles: {
        number: { value: 0, density: { enable: false, value_area: 1500 } },
        color: { value: particleColor },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 12 },
          image: { src: "img/github.svg", width: 100, height: 100 },
        },
        opacity: {
          value: 0.03,
          random: false,
          anim: { enable: false, speed: 0.05, opacity_min: 0.01, sync: true },
        },
        size: {
          value: 0,
          random: true,
          anim: { enable: false, speed: 5, size_min: 0.1, sync: true },
        },
        line_linked: {
          enable: false,
          distance: 500,
          color: lineColor,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: false,
          speed: 0.2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "bounce",
          bounce: false,
          attract: { enable: true, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: false, mode: "repulse" },
          onclick: { enable: true, mode: "repulse" },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: { distance: 300, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  }
}
particleActive.addEventListener("click", () => {
  checkParticleJS();
});
checkParticleJS();

var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
