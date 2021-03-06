class AnswerButton extends HTMLElement {
    connectedCallback() {
        var id = this.getAttribute('answer_target')
        var button = document.createElement('button')
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

console.log("I am in the Answer Button script")
customElements.define('answer-button', AnswerButton);