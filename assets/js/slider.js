"use strict";
class Slider {
  _fullscreenflag = 0;
  _currentsrcindex = 0;
  constructor(container) {
    this._container = container;
    this._slidername = container.querySelector(".mehdi-slider");
    this._source = container.querySelector(".slides");
    this._slides = container.querySelectorAll(".slide");
    this.lastindex = this._slides.length - 1;
    this._fullscreenicon = container.querySelector(".fullscreen-icon");
    this._subslider = document.querySelector(".sub-slider");
    this._adjustcircle = document.querySelector(".adjust-circle");
    this._appendAdjustCircle();
    this._createSubSlider();
    this._changeSrc(0);
    this._clickEvent();
  }
  _clickEvent() {
    this._container.addEventListener("click", (event) => {
      const { target } = event;
      const action = target.dataset.action;
      if (action && `_${action}` in this) {
        this[`_${action}`]();
      }
    });
    this._subslider.addEventListener("click", (event) => {
      const { target } = event;
      this._subslider.querySelectorAll("img").forEach((item, index) => {
        if (target === item) {
          this._adjustImage(index);
        }
      });
    });
    this._adjustcircle.addEventListener("click", (event) => {
      const { target } = event;
      this._adjustcircle.querySelectorAll("span").forEach((item, index) => {
        if (target === item) {
          this._adjustImage(index);
        }
      });
    });
  }
  _next() {
    clearInterval(this._sliderinterval);
    this._nextLogic();
  }
  _nextLogic() {
    this._Move(-1);
    if (this._currentsrcindex == this.lastindex) {
      this._slides.forEach((slide) => {
        slide.style.marginLeft = "+100%";
        this._slides[0].style.marginLeft = "0%";
      });

      this._currentsrcindex = -1;
    }
    const currentindex =
      this._currentsrcindex > this.lastindex ? 0 : this._currentsrcindex + 1;
    this._changeSrc(currentindex);
  }

  _previous() {
    clearInterval(this._sliderinterval);
    this._Move(+1);
    if (this._currentsrcindex == 0) {
      this._slides.forEach((slide) => {
        slide.style.marginLeft = "-100%";
        this._slides[this.lastindex].style.marginLeft = "0%";
      });
      this._currentsrcindex = this.lastindex + 1;
    }
    const currentindex =
      this._currentsrcindex <= 0 ? this.lastindex : this._currentsrcindex - 1;
    this._changeSrc(currentindex);
  }

  _changeSrc(newindex) {
    this._currentsrcindex = newindex;
    this._slides[this._currentsrcindex].style.display = "block";
    this._adjustcircle
      .querySelectorAll("span")
      [this._currentsrcindex].classList.toggle("animatecircle");
    this._subslider
      .querySelectorAll("img")
      [this._currentsrcindex].classList.toggle("animateimage");
  }
  _Move = (sign) => {
    console.log(`${sign * 100}%`);
    this._slides[this._currentsrcindex].style.marginLeft = `${sign * 100}%`;
    if (sign == -1 && this._currentsrcindex < this.lastindex) {
      this._slides[this._currentsrcindex + 1].style.marginLeft = "0";
    } else if (sign == +1 && this._currentsrcindex > 0) {
      this._slides[this._currentsrcindex - 1].style.marginLeft = "0";
    }
    this._adjustClassRemove();
  };
  _adjustClassRemove() {
    this._adjustcircle
      .querySelectorAll("span")
      [this._currentsrcindex].classList.remove("animatecircle");
    this._subslider
      .querySelectorAll("img")
      [this._currentsrcindex].classList.remove("animateimage");
  }

  _play() {
    this._sliderinterval = setInterval(() => {
      this._nextLogic();
    }, 1500);
  }
  _pause() {
    clearInterval(this._sliderinterval);
  }
  _fullScreen() {
    clearInterval(this._sliderinterval);
    this._fullscreenicon.classList.toggle("float-icon");
    const currentimage =
      this._slides[this._currentsrcindex].querySelector("img");
    if (this._fullscreenflag === 0) {
      currentimage.classList.add("fullscreen");
      this._fullscreenflag = 1;
    } else {
      currentimage.classList.remove("fullscreen");
      this._fullscreenflag = 0;
    }
  }

  _createSubSlider() {
    const template = document.getElementById("smallimage");
    this._slides.forEach((elem) => {
      const imageclone = template.content.cloneNode(true).firstElementChild;
      imageclone.innerHTML = imageclone.innerHTML.replace(
        /{{\s*(.*?)\s*}}/g,
        () => {
          return elem.firstElementChild.src;
        }
      );
      this._subslider.appendChild(imageclone);
    });
  }
  _adjustImage(index) {
    if (this._sliderinterval) {
      clearInterval(this._sliderinterval);
    }
    if (this._currentsrcindex < index) {
      const distance = index - this._currentsrcindex;
      for (let i = 0; i < distance; i++) {
        this._next();
      }
    }
    if (this._currentsrcindex > index) {
      const distance = this._currentsrcindex - index;
      for (let i = 0; i < distance; i++) {
        this._previous();
      }
    }
  }
  _appendAdjustCircle() {
    const template = document.getElementById("smallimage");
    this._slides.forEach(() => {
      const circles = template.content.cloneNode(true).lastElementChild;
      circles.innerHTML = circles.innerHTML.replace(/{{\s*(.*?)\s*}}/g, () => {
        return "adjust";
      });

      this._adjustcircle.appendChild(circles);
    });
  }
}
