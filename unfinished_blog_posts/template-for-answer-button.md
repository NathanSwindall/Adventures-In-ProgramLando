{% assign scriptUrl = "/blog-tech/assets/js/AnswerButton.js" %}
<script src="{{scriptUrl| relative_url}}"></script>
{{scriptUrl}}


<answer-button answer_target=1></answer-button>
<div markdown="1" id=1>
```elm
import HTTP
square : number -> number
square x = x * x 
```
</div>




<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@ThomasSwindall/GrandioseFatalStrategy?lite=true"></iframe>