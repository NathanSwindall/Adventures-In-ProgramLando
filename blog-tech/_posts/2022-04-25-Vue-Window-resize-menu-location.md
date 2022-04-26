---
layout: post
category: tech
title: Change Pop-up Menu Location With Resize
image: /assets/images/vueart.png
frontpage: frontpage
summary: When resizing the window, a pop-up menu should stay in the same place!
date: 2022-04-15
author: Nathan Swindall
---

```js
    
    /**
     * @summary adds event listener when the component gets destroyed.
     */
    mounted() {
        window.addEventListener("resize", this.changeMenuLocation)
    }

    /**
     * @summary Removes event listener when the component gets destroyed.
     */
    destroyed() {
        window.removeEventListener("resize", this.changeMenuLocation)
    }
```


```js
private changeMenuLocation(e: any): void {
        let element = document.getElementById("planned-" + this.identifier)
        let rect = element ? element.getBoundingClientRect() : null;
        if(rect !== null){
            this.xPosition = rect.left;
            this.yPosition = rect.top;
        }
    }
```