class AnswerButton extends HTMLElement {
    connectedCallback() {
        var id = this.getAttribute('answer_target')
        var button = document.createElement('button')

        // Styles
        button.style.backgroundColor = '#a5e07b'
        button.style.color = "#6b1e04"
        button.style.borderRadius = "8px"
        button.style.padding = "10px 12px"
        button.style.transitionDuration= "0.8s"
        button.style.fontWeight = "bold"
        button.style.margin = "10px 0"
        button.onmouseover = () => { button.style.backgroundColor = "white"}
        button.onmouseout = () => { button.style.backgroundColor = "#a5e07b"}
        button.style.cursor = "pointer"
        button.style.outline = "none"
        button.style.textDecoration = "none"
        button.innerText = `Answer`

        // Set the event
        button.addEventListener('click', function () {
            let answerDiv = document.getElementById(id)
            if (answerDiv.style.display === 'none' || answerDiv.style.display === "") {
                answerDiv.style.display = "block";
            } else {
                answerDiv.style.display = 'none';
            }});
        this.appendChild(button)

        
  }
}


customElements.define('answer-button', AnswerButton);