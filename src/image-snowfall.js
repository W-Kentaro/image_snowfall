/*!
* Copyright (c) 2019 W-Kentaro
* Released under the MIT license
*/
import * as PIXI from 'pixi.js-legacy';

export class Image_snowfall{
  constructor(options = {}) {
    this.state = {
      init: false,
    };
    let defaultConfig = {
      init: true,
      resize: true,
      source: [],
      param: {
        autoStart: true,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        view: document.querySelector('#ImageSnowfall'),
        transparent: true,
        forceCanvas: true
      },
      scale: {
        initial: 1,
        random: false,
        minScale: 1,
        maxScale: 6,
      },
      move: {
        overDistance: 100,
        x: {
          direction: 'bottom',
          speed: 5,
          random: true,
          minSpeed: 1,
          maxSpeed: 10,
          overDistance: 100,
        },
        y: {
          direction: 'right',
          speed: 5,
          random: true,
          minSpeed: 1,
          maxSpeed: 10,
          overDistance: 100,
        },
      },
      zIndex: {
        random: true,
        minIndex: 1,
        maxIndex: 10,
      },
      alpha: {
        initial: 1,
        random: true,
        minAlpha: .6,
        maxAlpha: 1,
      },
      rotate: {
        x: {
          enable: false,
          speed: 5,
          random: true,
          minSpeed: 1,
          maxSpeed: 10,
        },
        y: {
          enable: false,
          speed: 5,
          random: true,
          minSpeed: 1,
          maxSpeed: 10,
        },
      },
      addClass: true,
      activeClass: 'is-active',
      totalSprites: 10,
      random: {
        x: (pos) => {
          return Math.random() * pos;
        },
        y: (pos) => {
          return Math.random() * pos;
        },
        scale: (scale) => {
          return scale * .5 + Math.random() * 0.1;
        }
      }
    };
    this.config = Object.assign(defaultConfig, options);
    if(this.config.init){
      this.Init();
    }
  }
  Init() {
    this.instance = new PIXI.Application(this.config.param);
    let sprites = new PIXI.ParticleContainer(this.config.totalSprites, {
      scale: true,
      position: true
    });
    this.instance.stage.addChild(sprites);
    let particle = [];

    // source index random
    for(let i = this.config.source.length - 1; i > 0; i--){
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = this.config.source[i];
      this.config.source[i] = this.config.source[r];
      this.config.source[r] = tmp;
    }
    for(let i = 0; i < this.config.totalSprites; i++){
      let texture = PIXI.Texture.from(this.config.source[i % this.config.source.length]);
      particle.push(new PIXI.Sprite(texture));

      particle[i].anchor.set(0.5); // set center

      particle[i].scale.set(this.config.random.scale(0.8)); // re size

      particle[i].x = this.config.random.x(this.instance.screen.width);
      particle[i].y = this.config.random.y(this.instance.screen.height) * 1.3;

      particle[i].state = {
        scale: {
          x: {
            speed: Math.ceil(Math.random() * (5 - 1) + 1) * 0.001,
            max: Math.round(particle[i].scale.x * 100) / 100,
            direction: true
          }
        }
      };
      particle[i].scale.x = Math.round(particle[i].scale.x * 100) * -1 / 100;

      let randNum = Math.floor(Math.random() * (360 - 1) + 1);
      let radian = randNum * (Math.PI / 180);
      particle[i].rotation = radian;

      let index = Math.floor(Math.random() * (8 - 2) + 2);
      particle[i].zIndex = index;
      particle[i].alpha = index * .1;

      particle[i].speed = (6 + Math.random() * 2) * 0.25;

      this.instance.stage.addChild(particle[i]);
    }

    let tick = 0;
    const height = () => {
      return document.documentElement.clientHeight;
    };
    this.instance.ticker.add(() => {
      for(let i = 0; i < particle.length; i++){

        /*
        if(particle[i].state.scale.x.direction){

          if(particle[i].scale.x + particle[i].state.scale.x.speed >= particle[i].state.scale.x.max){
            particle[i].scale.x = particle[i].state.scale.x.max;
            particle[i].state.scale.x.direction = false;
          }else{
            particle[i].scale.x = particle[i].state.scale.x.direction ? particle[i].scale.x + particle[i].state.scale.x.speed : particle[i].scale.x - particle[i].state.scale.x.speed; // x軸回転
          }

        }else{
          if(particle[i].scale.x - particle[i].state.scale.x.speed <= particle[i].state.scale.x.max * -1){
            particle[i].scale.x = particle[i].state.scale.x.max * -1;
            particle[i].state.scale.x.direction = true;
          }else{
            particle[i].scale.x = particle[i].state.scale.x.direction ? particle[i].scale.x + particle[i].state.scale.x.speed : particle[i].scale.x - particle[i].state.scale.x.speed; // x軸回転
          }
        }
        particle[i].rotation = particle[i].rotation + 0.002; // 回転
        */

        if(this.config.move.x){
          particle[i].y -= particle[i].scale.y * particle[i].speed; // 上昇
          if(particle[i].y <= -60){

          }
        }

        // 一番上に到達したら
        if(particle[i].y <= -60){
          particle[i].y = height() + 160;
          particle[i].scale.x = particle[i].state.scale.x.max * -1;
          particle[i].x = this.config.random.x(this.instance.screen.width);
          particle[i].state.scale.x.speed = Math.ceil(Math.random() * (50 - 10) + 10) * 0.0001;

          let index = Math.floor(Math.random() * (8 - 2) + 2);
          particle[i].zIndex = index;
          particle[i].alpha = index * .1;
        }
      }
      tick += 0.1;
    });
  }
  Destroy() {
    if(this.state.init){
      this.instance.destroy();
      this.state.init = false;
    }
  }
  Resize() {
    if(this.config.resize){
      window.addEventListener('resize', () => {
        this.instance.renderer.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
      });
    }
  }
  Start() {
    if(this.state.init){
      this.instance.start();
    }
  }
  Stop() {
    if(this.state.init){
      this.instance.stop();
    }
  }
  AddClass() {
    this.config.param.view.classList.add(this.config.activeClass);
  }
  RemoveClass() {
    this.config.param.view.classList.remove(this.config.activeClass);
  }
}

window.Image_snowfall = Image_snowfall;