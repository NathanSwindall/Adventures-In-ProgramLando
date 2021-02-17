class AnswerBox2 extends HTMLElement {
    connectedCallback() {
        let id = this.getAttribute('id')
        let markdown = this.getAttribute('mark_d')
        let answerDiv = document.createElement('div')
        answerDiv.setAttribute('markdown',"1")
        answerDiv.setAttribute('id',id)
        let button = document.createElement('button')
        answerDiv.style.display = "block"
        answerDiv.innerText = `
        ```
        hello
        ```
        `
        button.addEventListener('click', () => {
            if(answerDiv.style.display == "none")
            {
                answerDiv.style.display = "block"
            }else 
            {
                answerDiv.style.display = "none"
            }
        })
        button.textContent = 
        `
        Natha
        `
        this.appendChild(button)
        this.appendChild(answerDiv)
      
  }
}

//That leaves us with the connectedCallback as the place to modify our element.
  customElements.define('answer-bx', AnswerBox2);

  // var x = shadowRoot.getElementById('myDIV');
  // if (x.style.display === "none") {
  //   x.style.display = "block";
  // } else {
  //   x.style.display = "none";
  // }

//   function showAnswer(){
//     var x = document.getElementById(id)
//     x.getElementById('answer-div')
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//          x.style.display = "none";
//     }
//  }