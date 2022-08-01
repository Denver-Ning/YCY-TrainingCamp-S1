class BrakeBanner {
  constructor(selector) {
    // 初始化PIXI应用，舞台设置为1920x1080
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window, // 设置窗口可调整大小
    });

    //添加到页面
    document.querySelector(selector).appendChild(this.app.view);
    this.stage = this.app.stage;
    // 加载图片
    this.loader = new PIXI.Loader();
    this.loader.add("btn.png", "images/btn.png");
    this.loader.add("btn_circle.png", "images/btn_circle.png");
    this.loader.add("brake_lever.png", "images/brake_lever.png");
    this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png");
    this.loader.add("brake_bike.png", "images/brake_bike.png");

    // 触发加载
    this.loader.load();

    // 加载完成后执行
    this.loader.onComplete.add(() => {
      this.show();
    });
  }
  show() {
    // return
    // 按钮
    let actionButton = this.createActionButton();
    actionButton.x = 420;
    actionButton.y = 320;

    // 车体
    const bikeContainer = new PIXI.Container();
    // 加载刹车把手
    const bikeLeverImage = new PIXI.Sprite(
      this.loader.resources["brake_lever.png"].texture
    );
    bikeContainer.addChild(bikeLeverImage);
    bikeLeverImage.pivot.x = 455;
    bikeLeverImage.pivot.y = 455;
    bikeLeverImage.x = 722;
    bikeLeverImage.y = 900;

    // 加载车型
    bikeContainer.scale.x = bikeContainer.scale.y = 0.3;
    const bikeImage = new PIXI.Sprite(
      this.loader.resources["brake_bike.png"].texture
    );
    // 加载车把手
    const bikeHandlerbarImage = new PIXI.Sprite(
      this.loader.resources["brake_handlerbar.png"].texture
    );
    bikeContainer.addChild(bikeHandlerbarImage, bikeImage);
    this.stage.addChild(bikeContainer);

    this.stage.addChild(actionButton);
    const resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width;
      bikeContainer.y = window.innerHeight - bikeContainer.height;
    };
    resize();
    window.addEventListener("resize", resize);
    actionButton.interactive = true; // 设置按钮可交互
    actionButton.buttonMode = true; // 小手模式

    // 按钮点击事件
    actionButton.on("mousedown", () => {
      // bikeLeverImage.rotation = Math.PI / 180* - 30;
      gsap.to(bikeLeverImage, {
        duration: 0.3,
        rotation: (Math.PI / 180) * -30,
      });
      pause();
    });
    actionButton.on("mouseup", () => {
      // bikeLeverImage.rotation = 0;
      gsap.to(bikeLeverImage, { duration: 0.3, rotation: 0 });
      start();
    });

    // 创建粒子
    let particleContainer = new PIXI.Container();
    this.stage.addChild(particleContainer);

    particleContainer.pivot.x = window.innerWidth / 2;
    particleContainer.pivot.y = window.innerHeight / 2;

    particleContainer.x = window.innerWidth / 2;
    particleContainer.y = window.innerHeight / 2;

    particleContainer.rotation = (35 * Math.PI) / 180;
    let particles = [];
    let colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818e9b];
    for (let i = 0; i < 20; i++) {
      let gr = new PIXI.Graphics();
      gr.beginFill(colors[Math.floor(Math.random() * colors.length)]);
      gr.drawCircle(0, 0, 4);
      gr.endFill();
      let pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr: gr,
      };
      gr.x = pItem.sx;
      gr.y = pItem.sy;
      particleContainer.addChild(gr);
      particles.push(pItem);
    }
    let speed = 0; // 速度
    function loop() {
      // 持续运动
      speed += 0.5;
      speed = Math.min(speed, 20);
      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i];
        pItem.gr.y += speed;
        // pItem.gr.rotation += 0.1;
        if (speed >= 20) {
          pItem.gr.scale.y = 20;
          pItem.gr.scale.x = 0.07;
        }
        if (pItem.gr.y > window.innerHeight) {
          pItem.gr.y = Math.random() * window.innerHeight;
        }
      }
    }
    function start() {
      speed = 0;
      gsap.ticker.add(loop);
      gsap.to(bikeImage, {
        duration: 0.3,
        y: 0,
        alpha:1,
      });
      gsap.to(bikeHandlerbarImage, {
        y: 0,
        duration: 0.3,
      });
      gsap.to(bikeLeverImage, {
        y: 900,
        duration: 0.3,
      });
    }
    function pause() {
      gsap.ticker.remove(loop);
      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i];

        pItem.gr.scale.y = 1;
        pItem.gr.scale.x = 1;

        gsap.to(pItem.gr, {
          duration: 0.6,
          x: pItem.sx,
          y: pItem.sy,
          ease: "elastic.out",
        });
      }
      gsap.to(bikeLeverImage, {
        y: 1000,
        duration: 0.3,
      });
      gsap.to(bikeImage, {
        duration: 0.3,
        alpha: 0.2,
        y: 100,
      });
      gsap.to(bikeHandlerbarImage, {
        y: 100,
        duration: 0.3,
      });
    }
    start();
    // 粒子有多个颜色
    // 向某一个角度持续移动
    // 超出边界后回到顶部继续移动
    // 按住鼠标停止
    // 停止得时候还有一点回弹的效果
    // 松开鼠标继续
  }

  // 创建按钮方法
  createActionButton() {
    // 创建按钮容器
    let actionButton = new PIXI.Container();
    // 创建按钮
    let btnImage = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
    let btnCircle = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    let btnCircle2 = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    actionButton.addChild(btnImage, btnCircle, btnCircle2);
    btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2;
    btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2;
    btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2;

    gsap.to(btnCircle.scale, { duration: 1, x: 1.2, y: 1.2, repeat: -1 });
    gsap.to(btnCircle, { duration: 1, alpha: 0, repeat: -1 });
    return actionButton;
  }
}
