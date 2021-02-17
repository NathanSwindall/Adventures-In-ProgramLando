class AnswerBox extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({mode: 'open'});
      let style = document.createElement('style')
      let div = document.createElement('div')
     div.textContent = 
      `
      This will come and go
      `
    style.textContent = 
      `button {
              background: tomato; 
              color: white;
          }`
      let button = document.createElement('button')
      button.textContent = 
      `
      hello
      `
      button.setAttribute('onClick',"myfunc()")
      let script = document.createElement('script')
      script.textContent =
      `
      function myfunc(){
        console.log("hello,word")
        var a = 1000
        console.log(this.document.getElementsByTagName('answer-box.div'))
        console.log(this.document.querySelector('#shadow-root'))
        var x = document.querySelector('answer-box').shadowRoot.querySelector('div')
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
   
      }
        `
    
    div.setAttribute('id', 'myDIV')
      shadow.appendChild(style)
      shadow.appendChild(button)
      shadow.appendChild(div)
      shadow.appendChild(script)
    }
  }

//That leaves us with the connectedCallback as the place to modify our element.
  
  customElements.define('answer-box', AnswerBox);

  // var x = shadowRoot.getElementById('myDIV');
  // if (x.style.display === "none") {
  //   x.style.display = "block";
  // } else {
  //   x.style.display = "none";
  // }