# require-title

`<title>` must be present in the `<head>` tag.

**good**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>html-lint</title>
  </head>
</html>
```

**bad**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta ..>
  </head>
</html> 
```

```html
<!DOCTYPE html>
<html>
  <body></body>
</html> 
```
