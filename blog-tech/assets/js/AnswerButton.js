class AnswerButton extends HTMLElement {
    connectedCallback() {
        let id = this.getAttribute('answer_target')
        let button = document.createElement('button')
        button.innerText = `Answer`
        button.addEventListener('click', function () {
            var x = document.getElementById(id)
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }});
        this.appendChild(button)
        
  }
}


customElements.define('answer-button', AnswerButton);