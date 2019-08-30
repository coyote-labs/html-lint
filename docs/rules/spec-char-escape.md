# spec-char-escape

Special characters need to be escaped.
This rule checks for `>`, `<` and `&`.

**good**

```html
<p>HTML &amp; CSS</p>
```

**bad**

```html
<p>HTML & CSS</p>
```
