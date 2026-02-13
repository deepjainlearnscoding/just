# How to Add Nidhi's Photo to the Special Page

## Quick Steps:

1. **Create a photos folder** (if you haven't already)
   - Go to: `c:\DEEPXCODE\GitHub\Just a test\`
   - Create a new folder called `photos`

2. **Add Nidhi's photo**
   - Put your photo in the `photos` folder
   - Rename it to: `nidhi.jpg`
   - Supported formats: .jpg, .jpeg, .png

3. **That's it!**
   - Refresh the special.html page
   - The photo will automatically appear in the frame
   - The big "I LOVE YOU, NIDHU" message will be below it

## File Structure:
```
Just a test/
├── index.html
├── special.html
├── photos/
│   └── nidhi.jpg  ← Put your photo here
└── ... (other files)
```

## Note:
- If you want to use a different filename, edit line 213 in `special.html`
- Change `src="photos/nidhi.jpg"` to your filename
- The photo will be automatically cropped to fit the square frame
