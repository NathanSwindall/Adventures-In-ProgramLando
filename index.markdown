---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home2
frontpage: featuredpost
---


<h1>Welcome!</h1>

This is my blog for my journey through the programming world and uncovering all the beauties and splendors along the way. I hope you have as much fun exploring the many blog posts as I did creating them, and If you are new here, there are two different blogs. One is my tech blog which I tackle fun and exciting frontiers like the world of functional programming and the other is ... well ... just random. I talk about fun topics such as getting your irish citizenship and cooking persian dishes. The post below is my feautured post to give you a taste of what's to come. Enjoy!


<h2>Featured post</h2>

{%- assign frontpage = "frontpage" -%}
<div class="front-page-image">
{%- assign displayOffset = 0 -%}
{%- assign displayLimit = 1 -%}
{%- assign sectionName = "featured-post" -%}
{% include feed.html %}
</div>


<p>Also, if you haven't, please subscribe to my RSS feed for updated posts.</p>


{% assign scriptUrl = "/blog-tech/assets/js/answerButton.js" | relative_url %}
<script src="{{scriptUrl}}"></script>
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






    





