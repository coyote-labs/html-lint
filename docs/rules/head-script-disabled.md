# head-script-disabled

Avoid using `<script>` tags in <head> without the `defer` or `async` attributes.

**good**

```html
<head>
  <script async src="my-script.js"></script>
</head>
```

```html
<head>
  <script defer src="my-script.js"></script>
</head>
```

```html
<head>
  <script async>
    console.log('hello');
  </script>
</head>
```

**bad**

```html
<head>
  <script="my-script.js"></script>
</head>
```

```html
<head>
  <script>
    console.log('hello');
  </script>
</head>
```
