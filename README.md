# setup-ninja

`shell: bash` is required on Windows.

## API

```yaml
platform: win | linux | mac (required)
tag: git tag name(e.g. v1.11.1) (optional)
```

## Example

```yaml
uses: wirekang/setup-ninja@v1
  with:
    platform: win
    tag: v1.11.1
```

## How it works

### 1. Make url from input

```js
`https://github.com/ninja-build/ninja/releases/download/${TAG}/ninja-${PLATFORM}.zip`
```

```yaml
platform: win
tag: v1.11.1

url: https://github.com/ninja-build/ninja/releases/download/v1.11.1/ninja-win.zip
```

### 2. Download and unzip using `unzip` command.

### 3. Add to PATH
