build-gif:
	ffmpeg -i dev-env-manager.mov -vf "palettegen" palette.png
	ffmpeg -i dev-env-manager.mov -i palette.png -filter_complex "fps=15,scale=800:-1:flags=lanczos,unsharp=5:5:0.8:5:5:0.0[x];[x][1:v]paletteuse" dev-env-manager.gif
