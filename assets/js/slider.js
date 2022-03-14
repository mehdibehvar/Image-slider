'use strict';
class Slider {
    constructor(container) {
        this._container = container;
        this._slidername=container.querySelector(".mehdi-slider");
        this._source = container.querySelector(".slides");
        this._slides = container.querySelectorAll(".slide");
        this._fullscreenicon=container.querySelector(".fullscreen-icon");
        this._subslider=document.querySelector(".sub-slider");
        this._adjustcircle=document.querySelector(".adjust-circle");
        this._appendadjustcircle();
        this._createsubslider();
        this._currentsrcindex = 0;
        this._fullscreenflag=0;
        this._changesrc(0);
        this._container.addEventListener("click", (event) => {
            const {target} = event;
            const action = target.dataset.action;
            if (action && `_${action}` in this) {
                this[`_${action}`]();
            }
        })
        this._subslider.addEventListener("click",(event)=>{
            const {target,currentTarget}=event;
            this._subslider.querySelectorAll("img").forEach((item,index)=>{
                   if(target===item){
                       this._adjustimage(index);
                   }
                 })
          
        })
        this._adjustcircle.addEventListener("click",(event)=>{
            const {target,currentTarget}=event;
            this._adjustcircle.querySelectorAll("span").forEach((item,index)=>{
                   if(target===item){
                       this._adjustimage(index);
                   }
                 })
        })
    }
    _next() {
      clearInterval(this._sliderinterval);
     this._nextlogic();
    }
    _nextlogic(){
        const lastindex = this._slides.length - 1;
        this._slides[this._currentsrcindex].style.marginLeft = "-100%";
       if(this._currentsrcindex<lastindex){
        this._slides[this._currentsrcindex + 1].style.marginLeft = "0";
       }
       this._adjustcircle.querySelectorAll("span")[this._currentsrcindex].classList.remove("animatecircle");
       this._subslider.querySelectorAll("img")[this._currentsrcindex].classList.remove("animateimage");

       if (this._currentsrcindex==lastindex) {
           this._slides.forEach(slide => {
               slide.style.marginLeft = "+100%";
               this._slides[0].style.marginLeft = "0%";
            });
            this._currentsrcindex =-1;
        }
        const currentindex = this._currentsrcindex > lastindex ? 0 : this._currentsrcindex + 1;
        this._changesrc(currentindex);
    }
    _previous() {
      clearInterval(this._sliderinterval);
          const lastindex = this._slides.length - 1;
          this._slides[this._currentsrcindex].style.marginLeft = "+100%";
         if(this._currentsrcindex>0){
          this._slides[this._currentsrcindex - 1].style.marginLeft = "0%";
         }
         this._adjustcircle.querySelectorAll("span")[this._currentsrcindex].classList.remove("animatecircle");
         this._subslider.querySelectorAll("img")[this._currentsrcindex].classList.remove("animateimage");

          const currentindex = this._currentsrcindex <= 0 ? lastindex : this._currentsrcindex - 1;
          if (currentindex===lastindex) {
            this._slides.forEach(slide => {
              slide.style.marginLeft = "-100%";
              this._slides[lastindex].style.marginLeft = "0%";
            });
            this._currentsrcindex=lastindex;
          }
          this._changesrc(currentindex)
    }

    _changesrc(newindex) {
        this._currentsrcindex = newindex;
        this._slides[this._currentsrcindex].style.display="block";
        this._adjustcircle.querySelectorAll("span")[this._currentsrcindex].classList.toggle("animatecircle");
        this._subslider.querySelectorAll("img")[this._currentsrcindex].classList.toggle("animateimage");
    }
   _play(){
     this._sliderinterval=setInterval(() => {
    this._nextlogic();
     }, 1500);

   }
   _pause(){
    clearInterval(this._sliderinterval); 
   }
   _fullscreen(){
    clearInterval(this._sliderinterval);
    this._fullscreenicon.classList.toggle("float-icon")
    const currentimage=this._slides[this._currentsrcindex].querySelector("img");
    if(this._fullscreenflag===0){
        currentimage.classList.add("fullscreen");
        this._fullscreenflag=1;
    }else{
        currentimage.classList.remove("fullscreen");
        this._fullscreenflag=0
    }
   }
   _createsubslider(){
       const template=document.getElementById("smallimage")
    this._slides.forEach((elem)=>{
        const imageclone=template.content.cloneNode(true).firstElementChild;
        imageclone.innerHTML=imageclone.innerHTML.replace(/{{\s*(.*?)\s*}}/g,()=>{
            return elem.firstElementChild.src;
        });
         this._subslider.appendChild(imageclone);
       })
   }
   _adjustimage(index){
   if(this._sliderinterval){
    clearInterval(this._sliderinterval); 
   }
if(this._currentsrcindex<index){
    const distance=index-this._currentsrcindex;
    for(let i=0;i<distance;i++){
      this._next()
    }
}
if(this._currentsrcindex>index){
    const distance=this._currentsrcindex-index;
    for(let i=0;i<distance;i++){
      this._previous()
    }
}

}
_appendadjustcircle(){
    const template=document.getElementById("smallimage")
    this._slides.forEach(()=>{
        const circles=template.content.cloneNode(true).lastElementChild;
        circles.innerHTML=circles.innerHTML.replace(/{{\s*(.*?)\s*}}/g,()=>{
            return "adjust";
        });
        this._adjustcircle.appendChild(circles)
       })
}
}
