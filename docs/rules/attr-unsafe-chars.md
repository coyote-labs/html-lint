# attr-unsafe-chars

Attribute values cannot use unsafe characters.

Unsafe characters - `/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g`

**good**

```html
<main data-title="test">
  <p>Hello</p>
</main>
```

**bad**

```html
<!-- A tab character is present before `test` -->
<main data-title="	test">
  <p>Hello</p>
</main>
```
